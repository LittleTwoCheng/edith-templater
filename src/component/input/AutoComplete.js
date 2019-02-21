import React, { Fragment, useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import { withStyles } from "@material-ui/core/styles";
import Downshift from "downshift";
import Popper from "@material-ui/core/Popper";
import ErrorMsg from "./ErrorMsg";

const styles = theme => ({
    chips: {
        display: "flex",
        justifyContent: "left",
        flexWrap: "wrap",
        padding: theme.spacing.unit / 2
    },
    chip: {
        margin: theme.spacing.unit / 2
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
        color: (console.log(theme), theme.palette.text.disabled)
    }
});

function getSuggestions(autoComplete, value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
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
}

function renderInput(inputProps) {
    const {
        InputProps,
        classes,
        ref,
        errors,
        helperText,
        name,
        startAdornment,
        ...other
    } = inputProps;

    return (
        <TextField
            InputProps={{
                inputRef: ref,
                startAdornment,
                ...InputProps
            }}
            InputLabelProps={{
                htmlFor: name,
                shrink: true
            }}
            helperText={
                !!errors[name] || helperText ? (
                    !!errors[name] ? (
                        <ErrorMsg name={name} error={errors[name]} />
                    ) : (
                        helperText
                    )
                ) : null
            }
            name={name}
            {...other}
        />
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

let popperNode = null;

const defaultRenderSuggestion = suggestion => (
    <span>
        {suggestion.label}
        {suggestion.tags && suggestion.tags.length ? "  " : ""}
        {suggestion.tags.map((tag, index) => (
            <Chip key={`${tag}-${index}`} label={tag} variant="outlined" />
        ))}
    </span>
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

        const onAutoCompleteChange = item => {
            if (repeatable) {
                setInputValue("");

                if (!item || !item.length) return;

                if (value.indexOf(item) !== -1) return;
                const updatedVal = [...value, item];
                onChange(null, { [name]: updatedVal }, data);
                return;
            }
            onChange(null, { [name]: item }, data);
            setInputValue(item);
        };

        const onInputChange = event => {
            setInputValue(event.target.value);

            if (!repeatable) {
                onChange(null, { [name]: event.target.value }, data);
            }
        };

        return (
            <Downshift
                onChange={onAutoCompleteChange}
                inputValue={inputValue}
                selectedItem={repeatable ? value : undefined}
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
                        {renderInput({
                            fullWidth,
                            classes,
                            InputProps: getInputProps({
                                onChange: onInputChange,
                                placeholder
                            }),
                            label,
                            ref: node => {
                                popperNode = node;
                            },
                            ...rest
                        })}
                        <Popper
                            open={isOpen}
                            anchorEl={popperNode}
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
                                        width: popperNode
                                            ? popperNode.clientWidth
                                            : null
                                    }}
                                >
                                    {getSuggestions(
                                        autoComplete,
                                        inputValue
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
                                                (repeatable
                                                    ? value
                                                    : [value]
                                                ).indexOf(suggestion.label) > -1
                                            }
                                            render={renderSuggestion}
                                        />
                                    ))}
                                </Paper>
                            </div>
                        </Popper>
                        {repeatable ? (
                            <div className={classes.chips}>
                                {value.map((val, idx) =>
                                    val ? (
                                        <Chip
                                            key={`${val}-${idx}`}
                                            label={val
                                                .split("\n")
                                                .map((item, key) => {
                                                    return (
                                                        <Fragment key={key}>
                                                            {item}
                                                            <br />
                                                        </Fragment>
                                                    );
                                                })}
                                            onDelete={
                                                disabled
                                                    ? null
                                                    : () => {
                                                          let mutatedVal = [
                                                              ...value
                                                          ];
                                                          mutatedVal.splice(
                                                              idx,
                                                              1
                                                          );
                                                          onChange(
                                                              null,
                                                              {
                                                                  [name]: mutatedVal
                                                              },
                                                              data
                                                          );
                                                      }
                                            }
                                            className={classes.chip}
                                        />
                                    ) : null
                                )}
                            </div>
                        ) : null}
                    </div>
                )}
            </Downshift>
        );
    }
);
