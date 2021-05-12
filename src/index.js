import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { QueryProvider } from "./query";
import { createMockServer } from "./mock-server";
import App from "./App";

if (process.env.NODE_ENV === "development") {
  createMockServer();
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
  rootElement
);
