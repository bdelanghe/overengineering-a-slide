import { promises as fs } from 'fs';
import * as path from 'path';
import { google, Auth } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Scopes for the Google Slides API
const SCOPES = ['https://www.googleapis.com/auth/presentations.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client | null>}
 */
async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf-8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials) as OAuth2Client;
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: OAuth2Client): Promise<void> {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request authorization to call APIs.
 *
 * @return {Promise<OAuth2Client>}
 */
async function authorize(): Promise<OAuth2Client> {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });

  client = await auth.getClient() as OAuth2Client;
  if (client.credentials) {
    await saveCredentials(client);
  }

  return client;
}

/**
 * Prints the number of slides and elements in a sample presentation:
 * https://docs.google.com/presentation/d/1EAYk18WDjIG-zp_0vLm3CsfQh_i8eXc67Jo2O9C6Vuc/edit
 * @param {OAuth2Client} auth The authenticated Google OAuth client.
 */
async function listSlides(auth: Auth.OAuth2Client): Promise<void> {
  const slidesApi = google.slides({ version: 'v1', auth });
  const res = await slidesApi.presentations.get({
    presentationId: '1EAYk18WDjIG-zp_0vLm3CsfQh_i8eXc67Jo2O9C6Vuc',
  });
  const slides = res.data.slides;

  if (!slides || slides.length === 0) {
    console.log('No slides found.');
    return;
  }

  console.log(`The presentation contains ${slides.length} slides:`);
  slides.forEach((slide, i) => {
    console.log(`- Slide #${i + 1} contains ${slide.pageElements?.length || 0} elements.`);
  });
}

authorize().then(listSlides).catch(console.error);
