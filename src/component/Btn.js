import React from "react";
import Button from "@material-ui/core/Button";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    button: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit
    }
});

export default withStyles(styles)(
    ({
        children,
        classes,
        type = "button",
        onClick = null,
        variant = "contained",
        color = "primary",
        size = "small",
        ...rest
    }) => (
        <Button
            variant={variant}
            color={color}
            className={classes.button}
            type={type}
            onClick={onClick}
            {...rest}
        >
            {children}
        </Button>
    )
);
