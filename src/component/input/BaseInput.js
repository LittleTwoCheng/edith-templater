import React from "react";
import Input from "@material-ui/core/Input";

export default ({
    id,
    name,
    value,
    type,
    onChange,
    placeholder = "",
    data = null,
    ...rest
}) => (
    <Input
        id={id}
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
);
