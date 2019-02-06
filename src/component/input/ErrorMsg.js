import React from "react";

const getMsg = error => {
    if (!error) return "";

    if (typeof error === "string") return error;
    if (error.message) return error.message;
    return error.toString();
};

export default ({ name, error }) => (
    <div className={`error error--${name}`}>{getMsg(error)}</div>
);
