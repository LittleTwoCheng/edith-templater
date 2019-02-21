import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

export default ({ anchorElement, onClose, onChange, settings }) => (
    <Menu
        anchorEl={anchorElement}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElement)}
        onClose={onClose}
    >
        {Object.keys(settings).map(settingName => (
            <MenuItem key={settingName} onClick={() => onChange(settingName)}>
                <p>{settingName}</p>
            </MenuItem>
        ))}
    </Menu>
);
