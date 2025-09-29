import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { ProviderContext } from "./context/provider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProviderContext>
      <App />
      <Toaster position="top-right" reverseOrder={false} />
    </ProviderContext>
  </StrictMode>
);
