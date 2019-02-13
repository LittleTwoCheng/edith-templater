import React from "react";

export default ({ label, value }) => (
    <span role="img" aria-label={label}>
        {value}
    </span>
);
