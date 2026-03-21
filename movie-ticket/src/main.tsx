import React from "react";
import { createRoot } from "react-dom/client";
import "@ant-design/v5-patch-for-react-19";
import "./assets/css/style.css";
import RouterConfig from "./config/router.config";
import { AuthProvider } from "./context/auth.context";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterConfig />
    </AuthProvider>
  </React.StrictMode>,
);
