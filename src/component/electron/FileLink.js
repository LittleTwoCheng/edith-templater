import { shell } from "electron";
import React from "react";

export default ({ path, renderButton }) => {
    const onClick = () => {
        console.log("click", { path });
        shell.openItem(path);
    };
    return (
        <div className="file-link">
            <div className="file-link__label">{path}</div>
            {renderButton({ onClick })}
        </div>
    );
};
