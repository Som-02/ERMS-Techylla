import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "@fontsource/inter";

import {
    PublicClientApplication,
} from "@azure/msal-browser";

import {
    MsalProvider,
} from "@azure/msal-react";

import App from "./App";
import "./index.css";

import AuthProvider from "./context/AuthContext";
import { msalConfig } from "./config/authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

const startApp = async () => {

    await msalInstance.initialize();

    ReactDOM.createRoot(
        document.getElementById("root")
    ).render(

        <React.StrictMode>

            <BrowserRouter>

                <MsalProvider
                    instance={msalInstance}
                >

                    <AuthProvider>

                        <Toaster
                            position="top-right"
                            reverseOrder={false}
                        />

                        <App />

                    </AuthProvider>

                </MsalProvider>

            </BrowserRouter>

        </React.StrictMode>
    );
};

startApp();