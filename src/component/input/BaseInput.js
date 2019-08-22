import React from "react";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";

export default ({
    id,
    name,
    value,
    type,
    onChange,
    placeholder = "",
    data = null,
    startAdornment = null,
    endAdornment = null,
    ...rest
}) => (
    <Input
        id={id}
        type={type}
        name={name}
        value={typeof value === "undefined" ? "" : value}
        onChange={onChange}
        aria-describedby={`helperText-${name}`}
        placeholder={placeholder}
        startAdornment={
            startAdornment ? (
                <InputAdornment position="start">
                    {startAdornment}
                </InputAdornment>
            ) : null
        }
        endAdornment={
            endAdornment ? (
                <InputAdornment position="end">
                    {endAdornment}
                </InputAdornment>
            ) : null
        }
        {...rest}
    />
);
