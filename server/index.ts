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
  const publicDir = path.resolve(__dirname, "..", "public");
  app.use(express.static(publicDir));
  app.get("*", (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
} else {
  // Dynamic import of development setup to avoid loading Vite in production
  const { setupDevelopment } = await import("./development.js");
  await setupDevelopment(app, server);
}

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});