import readXlsxFile from "read-excel-file/node";
import { join } from "path";

const SCHEMA_SET = [
    {
        name: "test",
        path: "report_test.xlsx",
        schema: {
            "Test name": {
                prop: "test_name",
                type: String,
                required: true
            },
            Division: {
                prop: "division",
                type: String,
                required: true
            }
        }
    },
    {
        name: "country",
        path: "country.xlsx",
        schema: {
            "Country Of Origin": {
                prop: "country_of_origin",
                type: String,
                required: true
            }
        }
    }
];
export default function getDataSetAsync(dirPath) {
    return Promise.all(
        SCHEMA_SET.map(data =>
            readXlsxFile(join(dirPath, data.path), {
                schema: data.schema
            }).then(({ rows, errors }) => {
                if (errors.length) {
                    console.error(errors);
                    throw Error(`fail to parse ${data.path}`);
                }
                return [data.name, rows];
            })
        )
    ).then(dataSetEntries =>
        dataSetEntries.reduce((merged, [name, rows]) => {
            merged[name] = rows;
            return merged;
        }, {})
    );
}
