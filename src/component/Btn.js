import React from "react";
export default ({ children, type = "button", onClick = null, ...rest }) => (
    <button
        className={`button ${type !== "button" ? `button--${type}` : ""}`}
        type={type}
        onClick={onClick}
        {...rest}
    >
        {children}
    </button>
);
