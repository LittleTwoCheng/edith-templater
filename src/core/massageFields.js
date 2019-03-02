import parse from "date-fns/parse";
import fnsFormat from "date-fns/format";

const massageFields = (fields, mapping) => {
    return Object.entries(mapping).reduce((merged, [name, typeMethod]) => {
        return typeMethod(merged, name);
    }, fields);
};

export default massageFields;

export const DATE = () => (fields, name) => ({
    ...fields,
    [name]: fnsFormat(parse(fields[name]), "DD MMM, YYYY")
}); //11 Feb, 2019

export const EMPTY_TO = emptyValue => (fields, name) => ({
    ...fields,
    [name]: fields[name] ? fields[name] : emptyValue
});

const CASE = isUpper => (fields, name) => {
    if (fields[name]) {
        fields[name] = isUpper
            ? fields[name].toUpperCase()
            : fields[name].toLowerCase();
    }
    return fields;
};
export const UPPER_CASE = () => CASE(true);
export const LOWER_CASE = () => CASE(false);

export const CUSTOM = fn => (fields, name) => fn(fields, name);
