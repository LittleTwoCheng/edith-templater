import React from "react";
import Paper from "@material-ui/core/Paper";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    form: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2
    }
});

export default withStyles(styles)(({ classes, children, onSubmit }) => (
    <form className={classes.form} onSubmit={onSubmit}>
        {children}
    </form>
));
