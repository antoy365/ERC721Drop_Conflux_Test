import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { Toaster } from "./components/ui/Toaster";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    {/* Мы убрали ThirdwebProvider, теперь приложение весит мало и загружается моментально */}
    <Toaster />
    <App />
  </React.StrictMode>,
);
