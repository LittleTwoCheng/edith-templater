import React from "react";
import { render } from "react-dom";
import App from "./App";

import StyleProvider from "../component/StyleProvider";
import SnackbarProvider from "./SnackbarProvider";

import THEME from "./theme";

import { ipcRenderer } from "electron";

const dispatch = ({ type, payload }) => {
    ipcRenderer.send("appEvent", {
        type,
        payload
    });
};

ipcRenderer.on("appUpdated", (event, { appData, store }) => {
    render(
        <StyleProvider theme={THEME}>
            <SnackbarProvider>
                <App appData={appData} store={store} dispatch={dispatch} />
            </SnackbarProvider>
        </StyleProvider>,
        document.getElementById("app")
    );
});
