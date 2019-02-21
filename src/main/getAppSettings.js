const readJson = require("./readJson").default;
const { lstatSync, readdirSync } = require("fs");
const path = require("path");
const { join } = path;

const isDirectory = source => lstatSync(source).isDirectory();
const allDir = source =>
    readdirSync(source).filter(name => isDirectory(join(source, name)));

export default function getAppSettings(dirPath, getTemplateNames) {
    const settingNames = allDir(dirPath);

    return settingNames.reduce((merged, settingName) => {
        const setting = readJson(join(dirPath, settingName, "setting.json"));

        merged[settingName] = {
            ...setting,
            templateNames: getTemplateNames(
                join(dirPath, settingName, "templates")
            )
        };
        return merged;
    }, {});
}
