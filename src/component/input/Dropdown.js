import React, { Fragment } from "react";
import ErrorMsg from "./ErrorMsg";

export default ({
    label,
    name,
    value,
    options,
    onChange,
    errors = {},
    data = null,
    ...rest
}) => {
    return (
        <Fragment>
            <label className="label">
                {label}
                <select
                    className="input input--dropdown"
                    name={name}
                    value={typeof value === "undefined" ? "" : value}
                    onChange={event =>
                        onChange(event, { [name]: event.target.value }, data)
                    }
                    {...rest}
                >
                    <option value="">{` -- ${label} -- `} </option>
                    {Object.entries(options).map(([val, label]) => (
                        <option key={val} value={val}>
                            {label}
                        </option>
                    ))}
                </select>
            </label>
            <ErrorMsg name={name} error={errors[name]} />
        </Fragment>
    );
};
