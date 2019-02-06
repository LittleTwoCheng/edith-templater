const JSZip = require("jszip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const path = require("path");

const createError = require("./createError");
const uuid = require("./uuid");

const compose = (templatePath, outputDir) => {
    return fields => {
        //Load the docx file as a binary
        var content = fs.readFileSync(
            //path.resolve(__dirname, `../../${templatePath}`),
            templatePath,
            "binary"
        );

        var zip = new JSZip(content);

        var doc = new Docxtemplater();
        doc.loadZip(zip);

        //set the templateVariables
        doc.setData(fields);

        try {
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
            doc.render();
        } catch (error) {
            console.log(JSON.stringify({ error: e }));
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
            throw createError(`${error.name}.${error.message}`, {
                [error.name]: error.message
            });
        }

        var buf = doc.getZip().generate({ type: "nodebuffer" });

        var randomFileName = `wordTemplater-${uuid()}`;
        const outputPath = path.resolve(
            __dirname,
            `${outputDir}/${randomFileName}.docx`
        );

        // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
        fs.writeFileSync(outputPath, buf);

        return outputPath;
    };
};

module.exports = {
    compose
};
