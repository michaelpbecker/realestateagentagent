import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import type { Server } from 'http';
import type { IncomingMessage, ServerResponse } from 'http';
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function createServer(httpServer: Server<typeof IncomingMessage, typeof ServerResponse>) {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: {
        server: httpServer
      },
      allowedHosts: ['localhost', '127.0.0.1']
    },
    appType: 'custom'
  });

  return vite;
}

export async function setupDevelopment(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: ['localhost', '127.0.0.1'],
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
} 