import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log('main.tsx is executing'); // Debug log

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Failed to find the root element'); // Debug log
} else {
  console.log('Root element found, creating React root'); // Debug log
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}