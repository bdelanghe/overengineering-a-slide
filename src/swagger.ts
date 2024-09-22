import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

// Swagger options
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Google Slides API",
			version: "1.0.0",
			description: "API documentation for Google Slides Automation",
		},
		servers: [{ url: "http://localhost:3000" }],
	},
	apis: ["./src/routes/*.ts"], // Path to your route files
};

// Initialize Swagger docs
const swaggerSpec = swaggerJsDoc(options);

export const setupSwaggerDocs = (app: Express) => {
	// Serve Swagger UI
	app.use(
		"/api-docs",
		swaggerUi.serve,
		swaggerUi.setup(swaggerSpec, {
			swaggerOptions: {
				urls: [
					{
						url: "/api-docs.json",
						name: "OpenAPI Spec",
					},
				],
			},
		}),
	);

	// Serve the OpenAPI spec as JSON for download
	app.get("/api-docs.json", (req, res) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});
};
