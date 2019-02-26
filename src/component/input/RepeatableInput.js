import React, { Fragment, useState } from "react";
import BaseInput from "./BaseInput";
import Chips from "../Chips";
import Collapse from "@material-ui/core/Collapse";
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
        disabled = false,
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
                        // console.log("onChange", {
                        //     val: event.target.value
                        // });
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
                    disabled={disabled}
                    {...rest}
                />
                <Collapse in={value.length > 0}>
                    <Chips
                        list={value}
                        disabled={disabled}
                        onDelete={(label, idx) => {
                            let mutatedVal = [...value];
                            mutatedVal.splice(idx, 1);
                            onChange(
                                null,
                                {
                                    [name]: mutatedVal
                                },
                                data
                            );
                        }}
                    />
                </Collapse>
            </Fragment>
        );
    }
);
