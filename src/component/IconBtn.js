import React from "react";
import Btn from "./Btn";

import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    leftIcon: {
        marginRight: theme.spacing.unit
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    },
    iconOnly: {}
});

export const ICON_LEFT = "left";
export const ICON_RIGHT = "right";
export const ICON_ONLY = "icon_only";

export default withStyles(styles)(
    ({ children, classes, Icon, iconPosition = ICON_LEFT, title = "", iconProps = {}, ...rest }) =>
        title ? (
            <Tooltip title={title}>
                <Btn {...rest}>
                    {iconPosition === ICON_LEFT ? (
                        <Icon className={classes.leftIcon} {...iconProps} />
                    ) : null}
                    {iconPosition === ICON_ONLY ? (
                        <Icon className={classes.iconOnly} {...iconProps} />
                    ) : (
                        children
                    )}
                    {iconPosition === ICON_RIGHT ? (
                        <Icon className={classes.rightIcon} {...iconProps} />
                    ) : null}
                </Btn>
            </Tooltip>
        ) : (
            <Btn {...rest}>
                {iconPosition === ICON_LEFT ? (
                    <Icon className={classes.leftIcon} {...iconProps} />
                ) : null}
                {iconPosition === ICON_ONLY ? (
                    <Icon className={classes.iconOnly} {...iconProps} />
                ) : (
                    children
                )}
                {iconPosition === ICON_RIGHT ? (
                    <Icon className={classes.rightIcon} {...iconProps} />
                ) : null}
            </Btn>
        )
);
