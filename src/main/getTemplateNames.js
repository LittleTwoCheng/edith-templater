const path = require("path");
const { readdirSync } = require("fs");

const isDocx = name => path.extname(name) === ".docx";
const allFileName = dirPath =>
    readdirSync(dirPath).filter(name => isDocx(name));

export default function getTemplateNames(templateDirPath) {
    return allFileName(templateDirPath);
}
