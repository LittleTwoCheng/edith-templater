import React, { Fragment, useState, useRef } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import FormControlWithLabel from "./FormControlWithLabel";
import BaseInput from "./BaseInput";
import { withStyles } from "@material-ui/core/styles";
import Downshift from "downshift";
import Popper from "@material-ui/core/Popper";
import Chips from "../Chips";
import PhaseHighlight from "../PhaseHighlight";
import Collapse from "@material-ui/core/Collapse";

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
    noSuggestions: {
        fontWeight: 500,
        color: theme.palette.text.disabled
    },
    selectedSuggestion: {
        fontWeight: 500,
        color: theme.palette.text.disabled
    }
});

function getSuggestions(autoComplete, value) {
    const inputValue = value.trim().toLowerCase();
    const regEx = new RegExp(inputValue, "gi");
    const inputLength = inputValue.length;
    let count = 0;


    const result =
        inputLength === 0
            ? []
            : autoComplete.suggestions.filter(suggestion => {
                  const keep = count < 12 && regEx.test(suggestion.label.toLowerCase());

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

const Suggestions = ({
    classes,
    autoComplete,
    inputValue,
    getItemProps,
    highlightedIndex,
    selectedItem,
    render
}) => {
    const suggestions = getSuggestions(autoComplete, inputValue);

    if (suggestions.length)
        return suggestions.map((suggestion, index) => (
            <Suggestion
                key={suggestion.label}
                classes={classes}
                suggestion={suggestion}
                itemProps={getItemProps({
                    item: suggestion.label
                })}
                inputValue={inputValue}
                isHighlighted={index === highlightedIndex}
                isSelected={selectedItem.indexOf(suggestion.label) > -1}
                render={render}
            />
        ));

    if (!autoComplete.noSuggestions || inputValue.length === 0) return null;

    return (
        <MenuItem
            selected={false}
            component="div"
            className={classes.noSuggestions}
            disabled
        >
            {autoComplete.noSuggestions({ inputValue })}
        </MenuItem>
    );
};

const Suggestion = ({
    classes,
    itemProps,
    inputValue,
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
        {render(suggestion, inputValue)}
    </MenuItem>
);

const defaultRenderSuggestion = (suggestion, inputValue) => (
    <Fragment>
        <PhaseHighlight highlight={inputValue}>
            {suggestion.label}
        </PhaseHighlight>
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
                                            setSelectedItem(mutatedVal);
                                        }}
                                    />
                                </Collapse>
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
                                    <Suggestions
                                        classes={classes}
                                        autoComplete={autoComplete}
                                        inputValue={
                                            repeatable ? inputValue : value
                                        }
                                        getItemProps={getItemProps}
                                        highlightedIndex={highlightedIndex}
                                        selectedItem={selectedItem}
                                        render={renderSuggestion}
                                    />
                                </Paper>
                            </div>
                        </Popper>
                    </div>
                )}
            </Downshift>
        );
    }
);
