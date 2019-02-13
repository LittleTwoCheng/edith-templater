import React, { useMemo, Fragment } from "react";

//https://material-ui.com/
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const StyleProvider = ({ children, theme }) => {
    const memoizedTheme = useMemo(() => createMuiTheme(theme), [theme]);
    return (
        <Fragment>
            <CssBaseline />
            <MuiThemeProvider theme={memoizedTheme}>
                {children}
            </MuiThemeProvider>
        </Fragment>
    );
};

export default StyleProvider;
