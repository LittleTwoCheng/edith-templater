import { compose } from "./createTemplate";
import messageFields, { DATE, EMPTY_TO, CUSTOM } from "./messageFields";

import { compose as composeValidate, SCHEMAS } from "../form/validate";
import COUNTRY_OF_ORIGINS from "../constant/countryOfOrigin";

import { remote } from "electron";
const { app } = remote;

const validateForm = composeValidate({
    properties: {
        report_no: SCHEMAS.STRING({
            minLength: 9,
            maxLength: 11,
            pattern: "^[0-9]{9}(-[A-Z])?$"
        }),
        age_grade: SCHEMAS.STRING({
            minLength: 0,
            maxLength: 100
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
            minLength: 0,
            pattern: "^[0-9A-Za-z/]*$"
        }),
        country_of_origin: SCHEMAS.OPTIONS(COUNTRY_OF_ORIGINS),
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
        "age_grade",
        "acceptance_date",
        "report_delivery_date",
        "applicant_name",
        "applicant_address",
        "product_name",
        "country_of_origin",
        "manufacturer_name",
        "manufacturer_address",
        "buyer_name",
        "buyer_address"
    ]
});

const formMessageMapping = {
    age_grade: CUSTOM((fields, name) => {
        fields[`${name}_with_label`] = fields[name]
            ? `Age Grade: ${fields[name]}`
            : "";
        delete fields[name];
        console.log("CUSTOM", { fields });
        return fields;
    }),
    acceptance_date: DATE(),
    report_delivery_date: DATE(),
    item_no: EMPTY_TO("N/A")
};

export default ({ template_name, ...fields }) => {
    console.log("fields", { fields, template_name });
    validateForm(fields);

    const createTemplate = compose(
        __static + `/${template_name}`,
        app.getPath("downloads")
    );
    return createTemplate(
        messageFields(fields, formMessageMapping),
        `Report_${fields.report_no}_`
    );
};
