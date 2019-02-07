import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import ErrorMsg from "./ErrorMsg";

const styles = theme => ({
    formControl: {
        padding: theme.spacing.unit / 2,
        marginBottom: theme.spacing.unit * 3,
        minWidth: "50%"
    }
});

export default withStyles(styles)(
    ({
        classes,
        label,
        name,
        value,
        options,
        onChange,
        fullWidth = false,
        errors = {},
        data = null,
        ...rest
    }) => {
        return (
            <FormControl
                className={classes.formControl}
                error={!!errors[name]}
                fullWidth={fullWidth}
            >
                <InputLabel htmlFor={name} shrink>
                    {label}
                </InputLabel>
                <Select
                    value={typeof value === "undefined" ? "" : value}
                    onChange={event =>
                        onChange(event, { [name]: event.target.value }, data)
                    }
                    input={<Input name={name} id={name} />}
                    {...rest}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {Object.entries(options).map(([val, label]) => (
                        <MenuItem key={val} value={val}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
                {!!errors[name] ? (
                    <FormHelperText>
                        <ErrorMsg name={name} error={errors[name]} />
                    </FormHelperText>
                ) : null}
            </FormControl>
        );
    }
);
