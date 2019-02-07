import { compose } from "./createTemplate";

import { compose as composeValidate, SCHEMAS } from "../form/validate";

import { remote } from "electron";
const { app } = remote;

const validateForm = composeValidate({
    properties: {
        report_no: SCHEMAS.STRING({
            minLength: 9,
            maxLength: 11,
            pattern: "^[0-9]{9}(-[A-Z])?$"
        }),
        acceptance_date: SCHEMAS.DATE(),
        report_delivery_date: SCHEMAS.DATE(),
        applicant_name: SCHEMAS.STRING({
            minLength: 1,
            maxLength: 999
        }),
        applicant_address: SCHEMAS.STRING({
            minLength: 1,
            maxLength: 9999
        }),
        product_name: SCHEMAS.STRING({
            minLength: 1,
            maxLength: 9999
        }),
        item_no: SCHEMAS.STRING({
            minLength: 1,
            pattern: "^[0-9A-Za-z]+$"
        }),
        country_of_origin: SCHEMAS.OPTIONS(["CHINA", "HONG KONG(China)"]),
        manufacturer_name: SCHEMAS.STRING({
            minLength: 1,
            maxLength: 999
        }),
        manufacturer_address: SCHEMAS.STRING({
            minLength: 1,
            maxLength: 9999
        }),
        buyer_name: SCHEMAS.STRING({
            minLength: 1,
            maxLength: 999
        }),
        buyer_address: SCHEMAS.STRING({
            minLength: 1,
            maxLength: 9999
        })
    },
    required: [
        "report_no",
        "acceptance_date",
        "report_delivery_date",
        "applicant_name",
        "applicant_address",
        "product_name",
        "item_no",
        "country_of_origin",
        "manufacturer_name",
        "manufacturer_address",
        "buyer_name",
        "buyer_address"
    ]
});

export default fields => {
    console.log("fields", { fields });
    validateForm(fields);

    const createTemplate = compose(
        __static + "/default.docx",
        app.getPath("downloads")
    );
    return createTemplate(fields, `Report_${fields.report_no}_`);
};
