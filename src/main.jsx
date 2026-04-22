/**
 * Application entry point.
 *
 * This file is responsible for bootstrapping the React application
 * and attaching it to the DOM.
 *
 * It:
 * - Locates the root DOM element
 * - Creates a React root
 * - Renders the App component
 *
 * This file does NOT:
 * - Contain application logic
 * - Manage state
 * - Render UI directly beyond the root component
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

/**
 * Global stylesheet containing base styles and browser defaults.
 */
import "./index.css";

/**
 * Root application component.
 */
import App from "./App.jsx";

/**
 * Locate the root DOM element where the React app will be mounted.
 */
const container = document.getElementById("root");

if (!container) {
  /**
   * Fail fast if the root element cannot be found.
   * This prevents silent errors and makes issues
   * easier to debug during development.
   */
  throw new Error("Root element with id 'root' not found");
}

/**
 * Create a React root and render the application.
 *
 * StrictMode is enabled to help catch potential issues
 * during development (e.g. unsafe lifecycles, side effects).
 */
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
