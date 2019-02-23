import React, { Fragment, useState, useRef } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import FormControlWithLabel from "./FormControlWithLabel";
import BaseInput from "./BaseInput";
import { withStyles } from "@material-ui/core/styles";
import Downshift from "downshift";
import Popper from "@material-ui/core/Popper";
import Chips from "../Chips";

const styles = theme => ({
    formControl: {
        padding: theme.spacing.unit / 2,
        marginBottom: theme.spacing.unit * 2,
        minWidth: "50%"
    },
    paper: {
        position: "absolute",
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0
    },
    suggestion: {
        fontWeight: 400
    },
    selectedSuggestion: {
        fontWeight: 500,
        color: theme.palette.text.disabled
    }
});

function getSuggestions(autoComplete, value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    const result =
        inputLength === 0
            ? []
            : autoComplete.suggestions.filter(suggestion => {
                  const keep =
                      count < 6 &&
                      suggestion.label.slice(0, inputLength).toLowerCase() ===
                          inputValue;

                  if (keep) {
                      count += 1;
                  }

                  return keep;
              });
    return result;
}

function renderInput(inputProps, extra) {
    const {
        InputProps,
        classes,
        ref,
        errors,
        helperText,
        label,
        name,
        startAdornment,
        fullWidth = false,
        ...other
    } = inputProps;
    // console.log("renderInput", { name, errors, helperText });
    return (
        <FormControlWithLabel
            name={name}
            label={label}
            errors={errors}
            fullWidth={fullWidth}
            helperText={helperText}
        >
            <BaseInput
                inputRef={ref}
                startAdornment={startAdornment}
                {...InputProps}
                {...other}
            />
            {extra}
        </FormControlWithLabel>
    );
}

const Suggestion = ({
    classes,
    itemProps,
    suggestion,
    isHighlighted,
    isSelected,
    render
}) => (
    <MenuItem
        {...itemProps}
        selected={isHighlighted}
        component="div"
        className={isSelected ? classes.selectedSuggestion : classes.suggestion}
    >
        {render(suggestion)}
    </MenuItem>
);

const defaultRenderSuggestion = suggestion => (
    <Fragment>
        {suggestion.label}
        {suggestion.tags && suggestion.tags.length ? (
            <Fragment>
                {"  "}
                <Chips
                    list={suggestion.tags}
                    Component={null}
                    variant="outlined"
                />
            </Fragment>
        ) : null}
    </Fragment>
);

export default withStyles(styles)(
    ({
        classes,
        autoComplete,
        label,
        name,
        value,
        placeholder,
        onChange,
        data,
        disabled,
        fullWidth,
        repeatable,
        renderSuggestion = defaultRenderSuggestion,
        ...rest
    }) => {
        const [inputValue, setInputValue] = useState(repeatable ? "" : value);
        const [selectedItem, setSelectedItem] = useState([]);
        const popperNode = useRef(null);

        const onAutoCompleteChange = item => {
            // console.log("🎯 onAutoCompleteChange", { item });
            if (repeatable) {
                setInputValue("");

                if (!item || !item.length) return;

                if (value.indexOf(item) !== -1) return;
                const updatedVal = [...value, item];
                onChange(null, { [name]: updatedVal }, data);
                setSelectedItem(updatedVal);
                return;
            }
            onChange(null, { [name]: item }, data);
            setInputValue(item);
            setSelectedItem([item]);
        };

        const onInputChange = event => {
            setInputValue(event.target.value);
            if (!repeatable) {
                onChange(null, { [name]: event.target.value }, data);
                setSelectedItem([]);
            }
        };

        // console.log("autoComplete render", {
        //     name,
        //     value,
        //     inputValue,
        //     selectedItem
        // });
        return (
            <Downshift
                onChange={onAutoCompleteChange}
                inputValue={repeatable ? inputValue : value}
                selectedItem={selectedItem}
                itemToString={item => (item ? item.label : "")}
            >
                {({
                    getInputProps,
                    getItemProps,
                    getMenuProps,
                    isOpen,
                    inputValue,
                    highlightedIndex
                }) => (
                    <div>
                        {renderInput(
                            {
                                name,
                                fullWidth,
                                classes,
                                InputProps: getInputProps({
                                    onChange: onInputChange,
                                    disabled,
                                    placeholder
                                }),
                                label,
                                ref: popperNode,
                                ...rest
                            },
                            repeatable ? (
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
                                        setSelectedItem(mutatedVal);
                                    }}
                                />
                            ) : null
                        )}
                        <Popper
                            open={isOpen}
                            anchorEl={popperNode.current}
                            placement={"bottom-start"}
                        >
                            <div
                                {...(isOpen
                                    ? getMenuProps(
                                          {},
                                          { suppressRefError: true }
                                      )
                                    : {})}
                            >
                                <Paper
                                    className={classes.paper}
                                    square
                                    style={{
                                        marginTop: 8,
                                        width:
                                            popperNode && popperNode.current
                                                ? popperNode.current.clientWidth
                                                : null
                                    }}
                                >
                                    {getSuggestions(
                                        autoComplete,
                                        repeatable ? inputValue : value
                                    ).map((suggestion, index) => (
                                        <Suggestion
                                            key={suggestion.label}
                                            classes={classes}
                                            suggestion={suggestion}
                                            itemProps={getItemProps({
                                                item: suggestion.label
                                            })}
                                            isHighlighted={
                                                index === highlightedIndex
                                            }
                                            isSelected={
                                                selectedItem.indexOf(
                                                    suggestion.label
                                                ) > -1
                                            }
                                            render={renderSuggestion}
                                        />
                                    ))}
                                </Paper>
                            </div>
                        </Popper>
                    </div>
                )}
            </Downshift>
        );
    }
);
