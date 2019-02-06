import React, { Fragment } from "react";
import ErrorMsg from "./ErrorMsg";

export default ({
    label,
    type,
    name,
    value,
    onChange,
    errors = {},
    data = null,
    ...rest
}) => (
    <Fragment>
        <label className="label">
            {label}
            <input
                className="input input--text"
                type={type}
                name={name}
                value={typeof value === "undefined" ? "" : value}
                onChange={event =>
                    onChange(event, { [name]: event.target.value }, data)
                }
                {...rest}
            />
        </label>
        <ErrorMsg name={name} error={errors[name]} />
    </Fragment>
);
