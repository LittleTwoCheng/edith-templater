import React from "react";
import { render } from "react-dom";
import App from "./App";

import StyleProvider from "../component/StyleProvider";
import SnackbarProvider from "./SnackbarProvider";

import THEME from "./theme";

require("electron").ipcRenderer.on("appDataLoaded", (event, { settings }) => {
    render(
        <StyleProvider theme={THEME}>
            <SnackbarProvider>
                <App settings={settings} />
            </SnackbarProvider>
        </StyleProvider>,
        document.getElementById("app")
    );
});
