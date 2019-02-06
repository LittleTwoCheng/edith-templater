import tv4 from "tv4";
import createError from "../core/createError";

export const compose = schema => {
    return fields => {
        var result = tv4.validateMultiple(fields, schema);
        if (!result) throw createError("Validation Failed.", result.errors);

        return true;
    };
};
export const SCHEMAS = {
    DATE: () => ({
        type: "string",
        pattern: "^[0-9]{4}-[0-1][0-9]-[0-3][0-9]$"
    }),
    OPTIONS: options => ({
        type: "string",
        pattern: `^(${options.join("|")})$`
    }),
    STRING: () => ({
        type: "string"
    }),
    PATTERN: pattern => ({
        type: "string",
        pattern
    }),
    ADDRESS: () => ({
        type: "string"
    })
};
