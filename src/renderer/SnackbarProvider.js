import React from "react";
import { SnackbarProvider } from "notistack";
import { withStyles } from "@material-ui/core/styles";

const mirgin = theme => theme.spacing.unit * 3;
const styles = theme => ({
    success: {
        backgroundColor: theme.palette.brand.green,
        marginLeft: mirgin(theme),
        marginRight: mirgin(theme)
    },
    error: {
        backgroundColor: theme.palette.brand.red,
        marginLeft: mirgin(theme),
        marginRight: mirgin(theme)
    },
    warning: {
        backgroundColor: theme.palette.brand.orange,
        marginLeft: mirgin(theme),
        marginRight: mirgin(theme)
    },
    info: {
        backgroundColor: theme.palette.brand.green.blue,
        marginLeft: mirgin(theme),
        marginRight: mirgin(theme)
    }
});

export default withStyles(styles)(({ classes, children }) => (
    <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
            vertical: "top",
            horizontal: "left"
        }}
        classes={{
            variantSuccess: classes.success,
            variantError: classes.error,
            variantWarning: classes.warning,
            variantInfo: classes.info
        }}
    >
        {children}
    </SnackbarProvider>
));
