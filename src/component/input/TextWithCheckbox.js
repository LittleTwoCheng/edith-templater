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
                onChange={onChange}
                data={data}
            />
        }
        errors={errors}
        onChange={onChange}
        data={data}
        {...rest}
        disabled={!checked}
    />
);
