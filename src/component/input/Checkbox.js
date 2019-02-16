import React from "react";
import Checkbox from "@material-ui/core/Checkbox";

export default ({ name, checked, onChange, data = null }) => (
    <Checkbox
        checked={checked}
        onChange={event =>
            onChange(event, { [name]: event.target.checked }, data)
        }
        value={name}
    />
);
