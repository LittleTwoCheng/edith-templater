import React from "react";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    page: {
        backgroundColor: theme.palette.secondary.light,
        padding: theme.spacing.unit * 2
    },
    paper: {
        backgroundColor: theme.palette.brand.white,
        opacity: 0.99,
        position: "relative",
        padding: theme.spacing.unit * 2
    }
});
export default withStyles(styles)(({ classes, children }) => (
    <div className={classes.page}>
        <Paper className={classes.paper}>{children}</Paper>
    </div>
));
