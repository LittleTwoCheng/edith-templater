import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
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
        repeatable = false,
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
            <FormControlLabel
                control={
                    <Switch
                        checked={value}
                        onChange={event =>
                            onChange(
                                event,
                                { [name]: event.target.checked },
                                data
                            )
                        }
                        value={name}
                    />
                }
                label={label}
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
