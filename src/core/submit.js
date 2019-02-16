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
            maxLength: 100,
            pattern: "^[0-9]{9}(-[A-Z0-9,]+)*$"
        }),
        labeled_age_grade: SCHEMAS.STRING({
            minLength: 0,
            maxLength: 100
        }),
        age_grade: SCHEMAS.STRING({
            minLength: 0,
            maxLength: 100
        }),
        client_specified_testing_age_grade: SCHEMAS.STRING({
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
        "labeled_age_grade",
        "age_grade",
        "client_specified_testing_age_grade",
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

const toMassageCheckableWithLabel = label => (fields, name) => {
    const checked = fields[`check_${name}`];
    delete fields[`check_${name}`];

    if (!checked) {
        fields[`${name}_with_label`] = "";
        delete fields[name];

        return fields;
    }

    fields[`${name}_with_label`] = fields[name]
        ? `${label} ${fields[name]}\n`
        : "";
    delete fields[name];
    console.log("CUSTOM", { fields });

    return fields;
};

const formMessageMapping = {
    labeled_age_grade: CUSTOM(
        toMassageCheckableWithLabel("Labeled Age Grade:")
    ),
    age_grade: CUSTOM(toMassageCheckableWithLabel("Age Grade:")),
    client_specified_testing_age_grade: CUSTOM(
        toMassageCheckableWithLabel("Client Specified Testing Age Grade:")
    ),
    acceptance_date: DATE(),
    report_delivery_date: DATE(),
    item_no: CUSTOM(toMassageCheckableWithLabel("Item No.:"))
};

export default ({ template_name, ...fields }) => {
    console.log("submit", {
        fields,
        template_name,
        path: __static + `/${template_name}`
    });
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
