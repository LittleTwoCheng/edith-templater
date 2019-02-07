import React from "react";
import { render } from "react-dom";
import App from "./App";

import StyleProvider from "../component/StyleProvider";
import SnackbarProvider from "./SnackbarProvider";

import THEME from "./theme";

render(
    <StyleProvider theme={THEME}>
        <SnackbarProvider>
            <App />
        </SnackbarProvider>
    </StyleProvider>,
    document.getElementById("app")
);
