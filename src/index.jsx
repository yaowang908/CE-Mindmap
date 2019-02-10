import React from "react";
import ReactDOM from "react-dom";
import App from "./App/index.jsx";
import { CookiesProvider } from "react-cookie";
import "../assets/app.scss";

ReactDOM.render(
    <CookiesProvider>
        <App />
    </CookiesProvider>
    ,
    document.getElementById("root")
);