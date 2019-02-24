import React from "react";

import Text from "./Text";
import Checkbox from "./Checkbox";

export default ({
    label,
    name,
    value,
    checkName,
    checked,
    onChange,
    errors = {},
    placeholder = "",
    data = null,
    repeatable = false,
    ...rest
}) => (
    <Text
        label={label}
        placeholder={placeholder}
        name={name}
        value={value}
        startAdornment={
            <Checkbox
                name={checkName}
                checked={checked}
                onChange={(event, updatedFields, data) => {
                    if (!updatedFields[checkName]) {
                        return onChange(
                            event,
                            { ...updatedFields, [name]: repeatable ? [] : "" },
                            data
                        );
                    }
                    return onChange(event, updatedFields, data);
                }}
                data={data}
            />
        }
        errors={errors}
        onChange={onChange}
        data={data}
        repeatable={repeatable}
        {...rest}
        disabled={!checked}
    />
);
