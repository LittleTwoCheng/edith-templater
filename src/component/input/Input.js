import React from "react";
import FormControlWithLabel from "./FormControlWithLabel";
import BaseInput from "./BaseInput";
import RepeatableInput from "./RepeatableInput";

export default ({
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
    <FormControlWithLabel
        name={name}
        label={label}
        errors={errors}
        fullWidth={fullWidth}
        helperText={helperText}
    >
        {repeatable ? (
            <RepeatableInput
                id={name}
                name={name}
                value={value}
                type={type}
                onChange={onChange}
                data={data}
                placeholder={placeholder}
                {...rest}
            />
        ) : (
            <BaseInput
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={event =>
                    onChange(event, { [name]: event.target.value }, data)
                }
                placeholder={placeholder}
                {...rest}
            />
        )}
    </FormControlWithLabel>
);
