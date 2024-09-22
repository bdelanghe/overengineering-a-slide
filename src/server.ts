import express from "express";
import authRoutes from "./routes/authRoutes";
import slideRoutes from "./routes/slideRoutes";
import { setupSwaggerDocs } from "./swagger";

const app = express();
const PORT = 3000;

// Register routes
app.use(authRoutes);
app.use(slideRoutes);

// Setup Swagger documentation
setupSwaggerDocs(app);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
	console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});
