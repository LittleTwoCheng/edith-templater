import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    error: {
        color: theme.palette.error.main,
        fontSize: "0.75rem",
        textAlign: "left",
        lineHeight: "1em"
    },
    general: {
        textAlign: "center"
    }
});

const getMsg = error => {
    if (!error) return "";

    if (typeof error === "string") return error;
    if (error.message) return error.message;
    return error.toString();
};

export default withStyles(styles)(({ classes, name, error }) => (
    <Typography
        className={`${classes.error} ${classes[name] || ""}`}
        component="span"
    >
        {getMsg(error)}
    </Typography>
));
