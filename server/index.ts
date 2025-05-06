import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { chatRouter } from "./api/chat.js";
import { calculationsRouter } from "./api/calculations.js";

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3000;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// API routes
app.use("/api/chat", chatRouter);
app.use("/api/calculations", calculationsRouter);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const publicDir = path.resolve(__dirname, "../public");
  console.log("Serving static files from:", publicDir);
  
  // Serve static files with proper MIME types
  app.use(express.static(publicDir, {
    setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  }));

  // Serve index.html for all other routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

// Start the server
app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Starting server on port ${port}`);
  console.log(`Server running at http://0.0.0.0:${port}`);
});