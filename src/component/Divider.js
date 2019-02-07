import React from "react";
import { withStyles } from "@material-ui/core/styles";
const styles = theme => ({
    large: {
        height: 50
    },
    middle: {
        height: 25
    },
    small: {
        height: 15
    }
});

export default withStyles(styles)(({ classes, variant = "large" }) => (
    <div className={classes[variant]} />
));
