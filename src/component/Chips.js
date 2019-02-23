import React, { Fragment } from "react";
import Chip from "@material-ui/core/Chip";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import LineBreak from "./LineBreak";

const styles = theme => ({
    chips: {
        display: "flex",
        justifyContent: "left",
        flexWrap: "wrap",
        padding: theme.spacing.unit / 2
    },
    chip: {
        maxWidth: "100%",
        margin: theme.spacing.unit / 2
    }
});

function renderInner({ classes, Component }, children) {
    if (Component === null) return children;

    return <Component className={classes.chips}>{children}</Component>;
}

export default withStyles(styles)(
    ({
        classes,
        list,
        disabled,
        variant = "default",
        Component = "div",
        tooltipDelay = 200,
        onDelete = null,
        data = null
    }) =>
        renderInner(
            { classes, Component },
            list.map((label, idx) =>
                label ? (
                    <Tooltip
                        key={`${label}-${idx}`}
                        title={<LineBreak>{label}</LineBreak>}
                        aria-label={label}
                        enterDelay={tooltipDelay}
                    >
                        <Chip
                            label={
                                <Typography noWrap>
                                    {label.split("\n").map((part, idx) => {
                                        return idx > 0 ? (
                                            "..."
                                        ) : (
                                            <Fragment key={idx}>
                                                {part}
                                            </Fragment>
                                        );
                                    })}
                                </Typography>
                            }
                            onDelete={
                                onDelete && !disabled
                                    ? () => onDelete(label, idx, data)
                                    : null
                            }
                            variant={variant}
                            className={classes.chip}
                        />
                    </Tooltip>
                ) : null
            )
        )
);
