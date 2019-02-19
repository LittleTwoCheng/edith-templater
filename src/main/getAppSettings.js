const { lstatSync, readdirSync, readFileSync } = require("fs");
const path = require("path");
const { join } = path;

const isDirectory = source => lstatSync(source).isDirectory();
const allDir = source =>
    readdirSync(source).filter(name => isDirectory(join(source, name)));

export default function getAppSettings(dirPath, getTemplateNames) {
    const settingNames = allDir(dirPath);

    return settingNames.reduce((merged, settingName) => {
        const setting = JSON.parse(
            readFileSync(join(dirPath, settingName, "setting.json"), "utf8")
        );

        merged[settingName] = {
            ...setting,
            templateNames: getTemplateNames(
                join(dirPath, settingName, "templates")
            )
        };
        return merged;
    }, {});
}
