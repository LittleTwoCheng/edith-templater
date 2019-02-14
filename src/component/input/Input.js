import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
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
        type,
        name,
        value,
        onChange,
        fullWidth = false,
        errors = {},
        data = null,
        placeholder = "",
        helperText = "",
        ...rest
    }) => (
        <FormControl
            className={classes.formControl}
            error={!!errors[name]}
            fullWidth={fullWidth}
        >
            <InputLabel htmlFor={name} shrink>
                {label}
            </InputLabel>
            <Input
                id={name}
                type={type}
                name={name}
                value={typeof value === "undefined" ? "" : value}
                onChange={event =>
                    onChange(event, { [name]: event.target.value }, data)
                }
                aria-describedby={`helperText-${name}`}
                placeholder={placeholder}
                {...rest}
            />
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
