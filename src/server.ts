import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import presentationRoutes from "./routes/presentationRoutes"; // Presentation routes
import pageRoutes from "./routes/pageRoutes"; // Add page (slide) routes
import { setupSwaggerDocs } from "./swagger";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Register routes
app.use("/auth", authRoutes); // Route for authentication-related routes
app.use("/api/presentations", presentationRoutes); // Route for presentation-related routes
app.use("/api/pages", pageRoutes); // Route for page (slide) related routes

// Setup Swagger documentation
setupSwaggerDocs(app);

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ message: "An unexpected error occurred!" });
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
	console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});
