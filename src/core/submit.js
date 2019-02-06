import { compose } from "./createTemplate";

import { compose as composeValidate, SCHEMAS } from "../form/validate";

import { remote } from "electron";
const { app } = remote;

const validateForm = composeValidate({
    report_no: SCHEMAS.PATTERN("^[0-9]{9}(-[A-Z])?$"),
    acceptance_date: SCHEMAS.DATE(),
    report_delivery_date: SCHEMAS.DATE(),
    applicant_name: SCHEMAS.STRING(),
    applicant_address: SCHEMAS.ADDRESS(),
    product_name: SCHEMAS.STRING(),
    item_no: SCHEMAS.PATTERN("^[0-9A-Za-Z]+$"),
    country_of_origin: SCHEMAS.OPTIONS(["CHINA", "HONG KONG(China)"]),
    manufacturer_name: SCHEMAS.STRING(),
    manufacturer_address: SCHEMAS.ADDRESS(),
    buyer_name: SCHEMAS.STRING(),
    buyer_address: SCHEMAS.ADDRESS()
});

export default fields => {
    console.log("fields", { fields });
    validateForm(fields);

    const createTemplate = compose(
        "static/default.docx",
        app.getPath("downloads")
    );
    return createTemplate(fields);
};
