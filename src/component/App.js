import React, { useState } from "react";
import submit from "../core/submit";

import Form from "./Form";
import TextInput from "./input/Text";
import DateInput from "./input/Date";
import DropdownInput from "./input/Dropdown";
import ErrorMsg from "./input/ErrorMsg";
import Actions from "./Actions";
import Btn from "./Btn";
import FileLink from "./electron/FileLink";

const COUNTRY_OF_ORIGINS = ["CHINA", "HONG KONG(CHINA)"];
const COUNTRY_OF_ORIGIN_OPTIONS = COUNTRY_OF_ORIGINS.reduce(
    (options, cor) => ({
        ...options,
        [cor]: cor
    }),
    {}
);
function App() {
    const [fields, setFields] = useState({});
    const [errors, setErrors] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [successResponse, setSuccess] = useState({});

    const onSubmit = event => {
        console.log("submit");
        event.stopPropagation();
        event.preventDefault();

        setLoading(true);
        try {
            const filePath = submit(fields);

            setLoading(false);
            setErrors({});
            setSuccess({ filePath });
        } catch (e) {
            setLoading(false);
            if (e.getErrors) {
                setErrors(e.getErrors());
            } else {
                throw e;
            }
        }
    };
    const onChange = (event, changedFields) => {
        console.log("field change", { changedFields });
        setFields({
            ...fields,
            ...changedFields
        });
    };
    const onTestClick = () => {
        console.log("TestClick");
        setFields({
            report_no: "123456789-T",
            acceptance_date: "2019-02-08",
            report_delivery_date: "2019-03-31",
            applicant_name: "John, Applicant Ho",
            applicant_address: "Applicant Building, Tin Shui Wai",
            product_name: "Pokemon Toy",
            item_no: "654321",
            country_of_origin: COUNTRY_OF_ORIGINS[0],
            manufacturer_name: "Man Lee",
            manufacturer_address: "Manufacturer Building, China",
            buyer_name: "Buyer Tom",
            buyer_address: "Buyer Building, Japan"
        });
    };
    console.log("App.render");

    return (
        <Form onSubmit={onSubmit}>
            <TextInput
                label="Report No."
                placeholder="e.g. 123456789-T"
                name="report_no"
                value={fields.report_no}
                errors={errors}
                onChange={onChange}
            />
            <DateInput
                label="Acceptance Date"
                name="acceptance_date"
                value={fields.acceptance_date}
                errors={errors}
                onChange={onChange}
            />
            <DateInput
                label="Report Delivery Date"
                name="report_delivery_date"
                value={fields.report_delivery_date}
                errors={errors}
                onChange={onChange}
            />
            <TextInput
                label="Applicant Client Name"
                placeholder="e.g. Joseph Whoever"
                name="applicant_name"
                value={fields.applicant_name}
                errors={errors}
                onChange={onChange}
            />
            <TextInput
                label="Applicant Address"
                placeholder="e.g. YY Building, 8F, 1-11-11 XXX, Whereever, Tokyo Japan 106-0041"
                name="applicant_address"
                value={fields.applicant_address}
                errors={errors}
                onChange={onChange}
            />
            <TextInput
                label="Product Name"
                placeholder="e.g. Toy Chop 2 Piece Set"
                name="product_name"
                value={fields.product_name}
                errors={errors}
                onChange={onChange}
            />
            <TextInput
                label="Item No."
                placeholder="e.g. 65432"
                name="item_no"
                value={fields.item_no}
                errors={errors}
                onChange={onChange}
            />
            <DropdownInput
                label="Country of Origin"
                name="country_of_origin"
                value={fields.country_of_origin}
                options={COUNTRY_OF_ORIGIN_OPTIONS}
                errors={errors}
                onChange={onChange}
            />
            <TextInput
                label="Manufacturer Name"
                placeholder="e.g. HHH DDD INDUSTRIAL (HK) LIMITED"
                name="manufacturer_name"
                value={fields.manufacturer_name}
                errors={errors}
                onChange={onChange}
            />
            <TextInput
                label="Manufacturer Address"
                placeholder="e.g. Xxx No2, Yy Village, LL Town, DongGuan City., China"
                name="manufacturer_address"
                value={fields.manufacturer_address}
                errors={errors}
                onChange={onChange}
            />
            <TextInput
                label="Buyer/Importer Name"
                placeholder="e.g. Buyer Whoever"
                name="buyer_name"
                value={fields.buyer_name}
                errors={errors}
                onChange={onChange}
            />
            <TextInput
                label="Buyer/Importer Address"
                placeholder="e.g. YY Building, 8F, 1-11-11 XXX, Whereever, Tokyo Japan 106-0041"
                name="buyer_address"
                value={fields.buyer_address}
                errors={errors}
                onChange={onChange}
            />
            <ErrorMsg name="general" error={errors.general} />
            <Actions>
                <Btn type="submit" disabled={isLoading}>
                    {isLoading ? "Loading" : "Submit"}
                </Btn>
                <Btn onClick={onTestClick} disabled={isLoading}>
                    Test
                </Btn>
            </Actions>
            <div className="success">
                {successResponse.filePath ? (
                    <FileLink
                        path={successResponse.filePath}
                        renderButton={({ onClick }) => (
                            <Btn onClick={onClick}>Open Document</Btn>
                        )}
                    />
                ) : null}
            </div>
        </Form>
    );
}

export default App;
