const create = require("docx-templates");
const path = require("path");

const createError = require("./createError");
const uuid = require("./uuid");

const compose = (templatePath, outputDir) => {
    return (fields, filePrefix = "wordTemplater-") => {
        var randomFileName = `${filePrefix}${uuid(4)}`;
        const outputPath = path.resolve(
            __dirname,
            `${outputDir}/${randomFileName}.docx`
        );

        try {
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)

            create({
                template: templatePath,
                output: outputPath,
                data: fields
            });
        } catch (error) {
            console.log("🤡", JSON.stringify({ error }));
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
            throw createError(`${error.name}.${error.message}`, {
                [error.name]: error.message
            });
        }

        return outputPath;
    };
};

module.exports = {
    compose
};
