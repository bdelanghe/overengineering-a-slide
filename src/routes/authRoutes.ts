import { Router } from "express";
import { auth, oauthCallback } from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * /auth/consent:
 *   get:
 *     summary: Redirect to Google OAuth2 consent page
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google consent page
 *       500:
 *         description: Error generating consent URL
 */
router.get("/auth/consent", auth);

/**
 * @swagger
 * /auth/callback:
 *   get:
 *     summary: Handle OAuth2 callback and process authorization code
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization code returned from Google OAuth2
 *     responses:
 *       200:
 *         description: Authorization successful
 *       400:
 *         description: Authorization code missing
 *       500:
 *         description: Error handling authorization code
 */
router.get("/auth/callback", oauthCallback);

/**
 * @swagger
 * /auth/callback:
 *   get:
 *     summary: Handle OAuth2 callback and process authorization code
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization code returned from Google OAuth2
 *     responses:
 *       200:
 *         description: Authorization successful
 *       400:
 *         description: Authorization code missing
 *       500:
 *         description: Error handling authorization code
 */
router.get("/oauth2callback", oauthCallback);

export default router;
