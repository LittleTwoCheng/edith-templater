import tv4 from "tv4";
import createError from "../core/createError";

tv4.setErrorReporter(function(error, data, schema) {
    switch (error.code) {
        case tv4.errorCodes.STRING_PATTERN:
            return `Incorrect Format. [CODE: ${error.code}]`;
        case tv4.errorCodes.STRING_LENGTH_SHORT:
            if (!error.params.length) return `Required.`;

            return error.message;
        case tv4.errorCodes.ARRAY_LENGTH_SHORT:
            if (!error.params.length) return `Required.`;

            return error.message;
        default:
            return error.message;
    }
});

const extractFieldName = dataPath => {
    return dataPath.replace(/(\/[0-9]*)/g, "");
};
const escapeRegExp = string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};
const mutateOptionals = (schema, fields) => {
    if (!schema.optional || !schema.optional.length)
        return {
            schema,
            fields
        };
    const mutatedSchema = { ...schema };
    const mutatedFields = { ...fields };

    mutatedSchema.required = [...schema.required];
    schema.optional.forEach(name => {
        const checked = mutatedFields[`check_${name}`];
        if (typeof checked !== "undefined") {
            delete mutatedFields[`check_${name}`];
            if (checked) {
                mutatedSchema.required.push(name);
            } else {
                delete mutatedFields[name];
            }
        }
    });

    delete mutatedSchema.optional;

    return {
        fields: mutatedFields,
        schema: mutatedSchema
    };
};

export const compose = schema => {
    return fields => {
        const {
            fields: mutatedFields,
            schema: mutatedSchema
        } = mutateOptionals(schema, fields);

        var result = tv4.validateMultiple(mutatedFields, mutatedSchema);
        // console.log("✅ Validation", {
        //     fields,
        //     mutatedFields,
        //     schema,
        //     mutatedSchema,
        //     result
        // });

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
    }),
    NUMBER: ({ ...rules }) => ({
        type: "number",
        ...rules
    }),
    INT: ({ ...rules }) => ({
        type: "integer",
        ...rules
    })
};
