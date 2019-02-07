import React from "react";
import Btn from "./Btn";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    leftIcon: {
        marginRight: theme.spacing.unit
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    }
});

export default withStyles(styles)(
    ({ children, classes, Icon, iconPosition = "left", ...rest }) => (
        <Btn {...rest}>
            {iconPosition === "left" ? (
                <Icon className={classes.leftIcon} />
            ) : null}
            {children}
            {iconPosition === "right" ? (
                <Icon className={classes.rightIcon} />
            ) : null}
        </Btn>
    )
);
