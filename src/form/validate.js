import tv4 from "tv4";
import createError from "../core/createError";

tv4.setErrorReporter(function(error, data, schema) {
    switch (error.code) {
        case tv4.errorCodes.STRING_PATTERN:
            return `Incorrect Format. [CODE: ${error.code}]`;
        case tv4.errorCodes.STRING_LENGTH_SHORT:
            if (!error.params.length) return `Required.`;

            return error.message;

        default:
            return error.message;
    }
});

const extractFieldName = dataPath => {
    return dataPath.replace("/", "");
};
const escapeRegExp = string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};
export const compose = schema => {
    return fields => {
        var result = tv4.validateMultiple(fields, schema);
        console.log("Validation", { fields, schema, result });

        if (!result.valid)
            throw createError(
                "Validation Failed.",
                result.errors.reduce((merged, error) => {
                    console.log({ error });
                    merged[extractFieldName(error.dataPath)] = error.message;
                    return merged;
                }, {})
            );

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
        pattern: `^(${options.map(escapeRegExp).join("|")})$`,
        minLength: 1
    }),
    STRING: ({ ...rules }) => ({
        type: "string",
        ...rules
    })
};
