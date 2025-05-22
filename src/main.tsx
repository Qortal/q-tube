import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

interface CustomWindow extends Window {
  _qdnBase: string;
}

const customWindow = window as unknown as CustomWindow;

const baseUrl = customWindow?._qdnBase || "";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter basename={baseUrl}>
    <App />
    <div id="modal-root" />
  </BrowserRouter>
);
