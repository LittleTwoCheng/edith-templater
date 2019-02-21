import React from "react";
import { render } from "react-dom";
import App from "./App";

import StyleProvider from "../component/StyleProvider";
import SnackbarProvider from "./SnackbarProvider";

import THEME from "./theme";

require("electron").ipcRenderer.on("appDataLoaded", (event, appData) => {
    render(
        <StyleProvider theme={THEME}>
            <SnackbarProvider>
                <App appData={appData} />
            </SnackbarProvider>
        </StyleProvider>,
        document.getElementById("app")
    );
});
