import React from "react";
import { render } from "react-dom";
import App from "./App";

import StyleProvider from "../component/StyleProvider";
import SnackbarProvider from "./SnackbarProvider";

import THEME from "./theme";

require("electron").ipcRenderer.on("templateLoaded", (event, templateNames) => {
    console.log("templateLoaded", templateNames);

    render(
        <StyleProvider theme={THEME}>
            <SnackbarProvider>
                <App templateNames={templateNames} />
            </SnackbarProvider>
        </StyleProvider>,
        document.getElementById("app")
    );
});
