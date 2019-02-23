import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import ErrorMsg from "./ErrorMsg";

const styles = theme => ({
    formControl: {
        padding: theme.spacing.unit / 2,
        marginBottom: theme.spacing.unit * 2,
        minWidth: "50%"
    }
});

export default withStyles(styles)(
    ({
        classes,
        label,
        name,
        children,
        errors = {},
        fullWidth = false,
        helperText = ""
    }) => (
        <FormControl
            className={classes.formControl}
            error={!!errors[name]}
            fullWidth={fullWidth}
        >
            <InputLabel htmlFor={name} shrink>
                {label}
            </InputLabel>
            {children}
            {!!errors[name] || helperText ? (
                <FormHelperText id={`helperText-${name}`}>
                    {!!errors[name] ? (
                        <ErrorMsg name={name} error={errors[name]} />
                    ) : (
                        helperText
                    )}
                </FormHelperText>
            ) : null}
        </FormControl>
    )
);
