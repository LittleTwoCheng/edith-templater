import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
const styles = theme => ({
    root: {
        margin: theme.spacing.unit,
        marginTop: theme.spacing.unit * 2,
        flexGrow: 1
    },
    label: {
        ...theme.typography.body2,
        color: theme.palette.brand.black
    },
    time: {
        ...theme.typography.body2,
        color: theme.palette.brand.gray,
        minWidth: 150
    },
    btn: {
        minWidth: 200,
        textAlign: "center"
    }
});

export default withStyles(styles)(
    ({ classes, path, time, dispatch, renderActions }) => {
        const onOpenDoc = event => {
            event.preventDefault();
            dispatch({ type: "document.open", payload: { path } });
        };

        return (
            <div className={classes.root}>
                <Grid
                    container
                    spacing={8}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs>
                        <Grid
                            container
                            spacing={8}
                            justify="center"
                            alignItems="center"
                        >
                            <Grid item xs className={classes.label}>
                                {path}
                            </Grid>
                            <Grid item xs className={classes.time}>
                                {time}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid className={classes.btn} item xs>
                        {renderActions({ onOpenDoc })}
                    </Grid>
                </Grid>
            </div>
        );
    }
);
