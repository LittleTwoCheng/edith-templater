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
    ...rest
}) => (
    <Text
        label={label}
        placeholder={placeholder}
        name={name}
        value={value}
        startAdornment={
            <Checkbox name={checkName} checked={checked} onChange={onChange} />
        }
        errors={errors}
        onChange={onChange}
        {...rest}
        disabled={!checked}
    />
);
