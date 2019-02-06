import React from "react";
export default ({ children, onSubmit }) => (
    <form className="form" onSubmit={onSubmit}>
        {children}
    </form>
);
