import React, { Fragment, useState } from "react";
import Chip from "@material-ui/core/Chip";
import BaseInput from "./BaseInput";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    chips: {
        display: "flex",
        justifyContent: "left",
        flexWrap: "wrap",
        padding: theme.spacing.unit / 2
    },
    chip: {
        margin: theme.spacing.unit / 2
    }
});

export default withStyles(styles)(
    ({
        classes,
        id,
        name,
        value,
        type,
        onChange,
        data = null,
        placeholder = "",
        ...rest
    }) => {
        const [inputValue, setInputValue] = useState("");
        return (
            <Fragment>
                <BaseInput
                    id={id}
                    type={type}
                    name={name}
                    value={inputValue}
                    onChange={event => {
                        console.log("onChange", {
                            val: event.target.value
                        });
                        setInputValue(event.target.value);
                    }}
                    onBlur={event => {
                        if (!inputValue || !inputValue.length) return;

                        const updatedVal = [...value, inputValue];
                        onChange(event, { [name]: updatedVal }, data);
                        setInputValue("");
                    }}
                    onKeyPress={event => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            event.stopPropagation();

                            if (!inputValue || !inputValue.length) return;

                            const updatedVal = [...value, inputValue];
                            onChange(event, { [name]: updatedVal }, data);
                            setInputValue("");
                        }
                    }}
                    placeholder={placeholder}
                    {...rest}
                />
                <div className={classes.chips}>
                    {value.map((val, idx) =>
                        val ? (
                            <Chip
                                key={`${val}-${idx}`}
                                label={val}
                                onDelete={() => {
                                    let mutatedVal = [...value];
                                    mutatedVal.splice(idx, 1);
                                    onChange(
                                        null,
                                        { [name]: mutatedVal },
                                        data
                                    );
                                }}
                                className={classes.chip}
                            />
                        ) : null
                    )}
                </div>
            </Fragment>
        );
    }
);
