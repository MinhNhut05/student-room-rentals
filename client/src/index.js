import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Filter out the "Unchecked runtime.lastError" messages
const originalError = console.error;
console.error = (...args) => {
  if (
    args[0]?.includes?.("Unchecked runtime.lastError") ||
    args[0]?.message?.includes?.("Unchecked runtime.lastError")
  ) {
    return;
  }
  originalError(...args);
};
