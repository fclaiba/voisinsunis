import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "next-themes";

import App from "../App";
import "../styles/globals.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with id \"root\" not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);

