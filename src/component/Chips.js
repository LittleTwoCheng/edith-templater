import React, { Fragment } from "react";
import Chip from "@material-ui/core/Chip";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import LineBreak from "./LineBreak";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

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

const SortableChip = SortableElement(({label, idx, tooltipDelay, disabled, onDelete, onClick, data, variant, classes}) => (
    <Tooltip
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
            onClick={
                onClick && !disabled
                    ? () => onClick(label, idx, data)
                    : null
            }
            variant={variant}
            className={classes.chip}
        />
    </Tooltip>
));

const SortableChips = SortableContainer(({list, ...rest}) => {
    return (
        <span>
            { list.filter(label => !!label).map((label, idx) => (
                <SortableChip
                    key={`${label}-${idx}`}
                    index={idx}
                    idx={idx}
                    label={label}
                    {...rest}
                />
            )) }
        </span>
    );
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
        onClick = null,
        onSort = null,
        data = null
    }) =>
        renderInner(
            { classes, Component },
            <SortableChips
                axis="x"
                pressDelay={200}
                onSortEnd={({oldIndex, newIndex}) => {
                    onSort({oldIndex, newIndex});
                }}
                classes={classes}
                list={list}
                disabled={disabled}
                variant={variant}
                tooltipDelay={tooltipDelay}
                onDelete={onDelete}
                onClick={onClick}
                data={data}
            />
        )
);
