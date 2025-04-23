import 'dotenv/config';
import express from "express";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { apiRouter } from "./api/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

// Log API requests
app.use(morgan("dev"));

// Parse JSON bodies
app.use(express.json());

// API routes
app.use("/api", apiRouter);

// Serve static files in production, use Vite in development
if (process.env.NODE_ENV === "production") {
  const publicDir = path.resolve("/app/dist/public");
  console.log("Serving static files from:", publicDir);
  
  // Serve static files
  app.use(express.static(publicDir));
  
  // Handle all other routes by serving index.html
  app.get("*", (req, res) => {
    console.log("Handling request for:", req.path);
    res.sendFile(path.join(publicDir, "index.html"));
  });
} else {
  // Dynamic import of development setup to avoid loading Vite in production
  const { setupDevelopment } = await import("./development.js");
  await setupDevelopment(app, server);
}

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
console.log(`Starting server on port ${port}`);

// Add error handling for the server
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});