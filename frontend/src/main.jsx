import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { PaperProvider } from "./context/PaperContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <PaperProvider>
        <App />
      </PaperProvider>
    </BrowserRouter>
  </StrictMode>,
);
