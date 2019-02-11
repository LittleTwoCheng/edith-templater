import React, { Fragment, useState } from "react";
import submit from "../core/submit";
import fnsFormat from "date-fns/format";
import uuid from "../core/uuid";

import Page from "../component/Page";
import Form from "../component/Form";
import TextInput from "../component/input/Text";
import DateInput from "../component/input/Date";
import DropdownInput from "../component/input/Dropdown";
import ErrorMsg from "../component/input/ErrorMsg";
import Actions from "../component/Actions";
import Btn from "../component/Btn";
import IconBtn, { ICON_ONLY } from "../component/IconBtn";
import Divider from "../component/Divider";
import FileLink from "../component/electron/FileLink";

import Typography from "@material-ui/core/Typography";
import DoneIcon from "@material-ui/icons/Done";
import SearchIcon from "@material-ui/icons/Search";
import DeleteIcon from "@material-ui/icons/Delete";
import Slide from "@material-ui/core/Slide";

import { withSnackbar } from "notistack";

import { get as getCache, set as setCache } from "../core/cache";

import COUNTRY_OF_ORIGINS, {
    options as COUNTRY_OF_ORIGIN_OPTIONS
} from "../constant/countryOfOrigin";

const TODAY_DATE = fnsFormat(new Date(), "YYYY-MM-DD");
const DEFAULT_FIELDS = {
    report_no: "",
    acceptance_date: TODAY_DATE,
    report_delivery_date: TODAY_DATE,
    age_grade: "",
    applicant_name: "",
    applicant_address: "",
    product_name: "",
    item_no: "",
    country_of_origin: "",
    manufacturer_name: "",
    manufacturer_address: "",
    buyer_name: "",
    buyer_address: ""
};
const TEST_FIELDS = {
    report_no: "123456789-T",
    acceptance_date: "2019-02-08",
    report_delivery_date: "2019-03-31",
    age_grade: "Ages 6 years old or over",
    applicant_name: "John, Applicant Ho",
    applicant_address: "Applicant Building, Tin Shui Wai",
    product_name: "Pokemon Toy",
    item_no: "654321",
    country_of_origin: COUNTRY_OF_ORIGINS[0],
    manufacturer_name: "Man Lee",
    manufacturer_address: "Manufacturer Building, China",
    buyer_name: "Buyer Tom",
    buyer_address: "Buyer Building, Japan"
};

const SUCCESS_STACK_CACHE_NAME = "success_stack";
const INITIAL_SUCCESS_STACK = getCache(SUCCESS_STACK_CACHE_NAME, []);
const MAX_SUCCESS_STACK_OFFSET = 10;

function App({ enqueueSnackbar, templateNames }) {
    const [fields, setFields] = useState({
        ...DEFAULT_FIELDS,
        template_name: templateNames[0]
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [successStack, setSuccessStack] = useState(INITIAL_SUCCESS_STACK);
    console.log("render", { fields });
    const onSubmit = event => {
        console.log("submit");
        event.stopPropagation();
        event.preventDefault();

        setLoading(true);
        try {
            const filePath = submit(fields);

            setLoading(false);
            setErrors({});

            const updatedSuccessStack = [
                {
                    id: uuid(),
                    time: fnsFormat(new Date(), "YYYY-MM-DD HH:mm:ss"),
                    filePath
                }
            ].concat(successStack);

            updatedSuccessStack.splice(MAX_SUCCESS_STACK_OFFSET, 1);

            setCache(SUCCESS_STACK_CACHE_NAME, updatedSuccessStack);
            setSuccessStack(updatedSuccessStack);

            enqueueSnackbar("Created!", {
                variant: "success",
                autoHideDuration: 3000
            });
        } catch (e) {
            console.log("catch error", { e });
            setLoading(false);
            if (e.getErrors) {
                setErrors(e.getErrors());
            } else {
                console.error(e);
            }
            enqueueSnackbar("Fail to generate from Template.", {
                variant: "error",
                autoHideDuration: 3000
            });
        }
    };
    const onChange = (event, changedFields) => {
        console.log("field change", { changedFields });

        setFields({
            ...fields,
            ...changedFields
        });

        //clean up error
        setErrors({});
    };
    const onRemoveStack = () => {
        const EMPTY = [];
        setCache(SUCCESS_STACK_CACHE_NAME, EMPTY);
        setSuccessStack(EMPTY);
    };
    const onTestClick = () => {
        console.log("TestClick");
        setFields({ ...fields, ...TEST_FIELDS });
    };
    console.log("App.render");

    return (
        <Fragment>
            <Page>
                <Typography align="center" variant="h5" component="h1">
                    MGSL (HK) Template Generator
                </Typography>
                <Form onSubmit={onSubmit}>
                    <TextInput
                        label="Report No."
                        placeholder="e.g. 123456789-T"
                        name="report_no"
                        value={fields.report_no}
                        errors={errors}
                        onChange={onChange}
                    />
                    <TextInput
                        label="Age Grade (Optional)"
                        placeholder="e.g. Ages 6 years old or over"
                        name="age_grade"
                        value={fields.age_grade}
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
                    <Divider />
                    <TextInput
                        label="Product Name"
                        placeholder="e.g. Toy Chop 2 Piece Set"
                        name="product_name"
                        value={fields.product_name}
                        errors={errors}
                        onChange={onChange}
                        fullWidth
                    />
                    <TextInput
                        label="Item No. (Optional)"
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
                    <Divider />
                    <TextInput
                        label="Applicant Client Name"
                        placeholder="e.g. Joseph Whoever"
                        name="applicant_name"
                        value={fields.applicant_name}
                        errors={errors}
                        onChange={onChange}
                        fullWidth
                    />
                    <TextInput
                        label="Applicant Address"
                        placeholder="e.g. YY Building, 8F, 1-11-11 XXX, Whereever, Tokyo Japan 106-0041"
                        name="applicant_address"
                        value={fields.applicant_address}
                        errors={errors}
                        onChange={onChange}
                        fullWidth
                    />
                    <Divider />
                    <TextInput
                        label="Manufacturer Name"
                        placeholder="e.g. HHH DDD INDUSTRIAL (HK) LIMITED"
                        name="manufacturer_name"
                        value={fields.manufacturer_name}
                        errors={errors}
                        onChange={onChange}
                        fullWidth
                    />
                    <TextInput
                        label="Manufacturer Address"
                        placeholder="e.g. Xxx No2, Yy Village, LL Town, DongGuan City., China"
                        name="manufacturer_address"
                        value={fields.manufacturer_address}
                        errors={errors}
                        onChange={onChange}
                        fullWidth
                    />
                    <Divider />
                    <TextInput
                        label="Buyer/Importer Name"
                        placeholder="e.g. Buyer Whoever"
                        name="buyer_name"
                        value={fields.buyer_name}
                        errors={errors}
                        onChange={onChange}
                        fullWidth
                    />
                    <TextInput
                        label="Buyer/Importer Address"
                        placeholder="e.g. YY Building, 8F, 1-11-11 XXX, Whereever, Tokyo Japan 106-0041"
                        name="buyer_address"
                        value={fields.buyer_address}
                        errors={errors}
                        onChange={onChange}
                        fullWidth
                    />
                    <ErrorMsg name="general" error={errors.general} />
                    <Btn
                        variant="text"
                        color="secondary"
                        onClick={onTestClick}
                        disabled={isLoading}
                        fullWidth
                    >
                        Test
                    </Btn>
                    <DropdownInput
                        label="Choose Docx Template"
                        name="template_name"
                        value={fields.template_name}
                        options={templateNames.reduce((options, name) => {
                            options[name] = name;
                            return options;
                        }, {})}
                        errors={errors}
                        onChange={onChange}
                        fullWidth
                    />
                    <IconBtn
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                        Icon={DoneIcon}
                        fullWidth
                    >
                        {isLoading ? "Loading" : "Submit"}
                    </IconBtn>
                </Form>
            </Page>
            {successStack.length ? (
                <Page elevation={4}>
                    <Typography align="center" variant="h5" component="h1">
                        Latest Downloads{" "}
                        <IconBtn
                            variant="text"
                            Icon={DeleteIcon}
                            iconPosition={ICON_ONLY}
                            onClick={onRemoveStack}
                        />
                    </Typography>
                    {successStack.map(success => (
                        <Slide
                            key={success.id}
                            direction="left"
                            in={true}
                            mountOnEnter
                            unmountOnExit
                        >
                            <FileLink
                                time={success.time}
                                path={success.filePath}
                                renderButton={({ onClick }) => (
                                    <IconBtn
                                        variant="text"
                                        Icon={SearchIcon}
                                        onClick={onClick}
                                        fullWidth
                                    >
                                        Open Document
                                    </IconBtn>
                                )}
                            />
                        </Slide>
                    ))}
                </Page>
            ) : null}
        </Fragment>
    );
}

export default withSnackbar(App);
