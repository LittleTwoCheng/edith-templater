import React, { Fragment, useState, useMemo } from "react";
import submit from "../core/submit";
import fnsFormat from "date-fns/format";
import uuid from "../core/uuid";
import pipe from "../core/pipe";

import Page from "../component/Page";
import Form from "../component/Form";
import TextInput from "../component/input/Text";
import TextInputWithCheckbox from "../component/input/TextWithCheckbox";
import DateInput from "../component/input/Date";
import DropdownInput from "../component/input/Dropdown";
import ErrorMsg from "../component/input/ErrorMsg";
import Btn from "../component/Btn";
import IconBtn, { ICON_ONLY } from "../component/IconBtn";
import Divider from "../component/Divider";
import SettingMenu from "../component/SettingMenu";
import FileLink from "../component/electron/FileLink";

import Typography from "@material-ui/core/Typography";
import DoneIcon from "@material-ui/icons/Done";
import SearchIcon from "@material-ui/icons/Search";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Slide from "@material-ui/core/Slide";

import { withSnackbar } from "notistack";

import { get as getCache, set as setCache } from "../core/cache";

const TODAY_DATE = fnsFormat(new Date(), "YYYY-MM-DD");
const DEFAULT_FIELDS = {
    report_no: "",
    acceptance_date: TODAY_DATE,
    report_delivery_date: TODAY_DATE,
    labeled_age_grade: "",
    age_grade: "",
    client_specified_testing_age_grade: "",
    applicant_name: "",
    applicant_address: "",
    product_names: [],
    item_nos: [],
    country_of_origin: "",
    manufacturer_name: "",
    manufacturer_address: "",
    buyer_name: "",
    buyer_address: "",
    tests: [],
    check_labeled_age_grade: true,
    check_age_grade: true,
    check_client_specified_testing_age_grade: true,
    check_item_nos: true,
    check_tests: true
};
const getTestFields = dataSet => ({
    report_no: "123456789-S1,2-R",
    acceptance_date: "2019-02-08",
    report_delivery_date: "2019-03-31",
    labeled_age_grade: "6 years old and over",
    age_grade: "6 years old and over",
    client_specified_testing_age_grade: "6 years old and over",
    applicant_name: "John, Applicant Ho",
    applicant_address: "Applicant Building, Tin Shui Wai",
    product_names: [
        "Pokemon Toy(Red)",
        "Pokemon Toy(Blue)",
        "Pokemon Toy(Green)"
    ],
    item_nos: ["654321", "765432"],
    country_of_origin: dataSet.country[0].country_of_origin,
    manufacturer_name: "Man Lee",
    manufacturer_address: "Manufacturer Building, China",
    buyer_name: "Buyer Tom",
    buyer_address: "Buyer Building, Japan",
    tests: ["TEST 1", "TEST 2", "TEST 3"],
    check_labeled_age_grade: true,
    check_age_grade: true,
    check_client_specified_testing_age_grade: true,
    check_item_nos: true,
    check_tests: true
});

const SUCCESS_STACK_CACHE_NAME = "success_stack";
const INITIAL_SUCCESS_STACK = getCache(SUCCESS_STACK_CACHE_NAME, []);
const MAX_SUCCESS_STACK_OFFSET = 10;

const getInitialSettingName = (settings, defaultName) => {
    const names = Object.keys(settings);
    if (names.indexOf(defaultName) !== -1) return defaultName;
    return names[0];
};

const reduceOnData = (dataSource, reducer) => changedFields => {
    return dataSource.reduce((accumulated, item) => {
        return reducer(accumulated, item, changedFields);
    }, changedFields);
};

const matchApplicantName = (list, targetName, applicantName) => {
    let match = false;
    if (
        list.some(item => {
            if (item.name === targetName) {
                match = item.applicant === applicantName;
                return true;
            }

            return false;
        })
    ) {
        console.log("FOUND", { targetName, applicantName, match });
        return match;
    }

    return false;
};

const resetIfApplicantNotMatch = (list, fields, target) => {
    return changedFields => {
        const targetField = fields[`${target}_name`];
        if (!targetField) return changedFields;

        if (matchApplicantName(list, targetField, changedFields.applicant_name))
            return changedFields;

        return {
            ...changedFields,
            [`${target}_name`]: "",
            [`${target}_address`]: ""
        };
    };
};

function App({ enqueueSnackbar, appData: { settings, dataSet } }) {
    const countryOfOriginOptions = useMemo(
        () =>
            dataSet.country.reduce((options, country) => {
                const name = country.country_of_origin;
                options[name] = name;
                return options;
            }, {}),
        [dataSet]
    );
    const testRequestedAutoComplete = useMemo(
        () => ({
            suggestions: dataSet.test.map(test => ({
                label: test.test_name,
                tags: [test.division]
            }))
        }),
        [dataSet]
    );

    const [settingName, setSettingName] = useState(
        getInitialSettingName(settings, "default")
    );
    const setting = settings[settingName];
    const { templateNames } = setting;

    const [settingMenuAnchorElement, setSettingMenuAnchorElement] = useState(
        null
    );

    const [fields, setFields] = useState({
        ...DEFAULT_FIELDS,
        template_name: templateNames[0]
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [successStack, setSuccessStack] = useState(INITIAL_SUCCESS_STACK);

    const onSubmit = event => {
        event.stopPropagation();
        event.preventDefault();

        setLoading(true);
        try {
            const filePath = submit({ settingName, ...fields });

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
    const onChange = (event, changedFields, data) => {
        console.log("field change", { changedFields, data });

        setFields({
            ...fields,
            ...(data && data.trigger
                ? data.trigger(changedFields)
                : changedFields)
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
        setFields({ ...fields, ...getTestFields(dataSet) });
    };
    console.log("App.render", { fields, dataSet });

    return (
        <Fragment>
            <Page>
                <Typography align="center" variant="h5" component="h1">
                    {setting.headline || "Edith Templater"}
                </Typography>
                <Typography
                    align="center"
                    variant="h6"
                    component="h2"
                    color="textSecondary"
                >
                    {setting.subHeadline || "A tool to generate Docx file"}
                </Typography>
                <div style={{ position: "absolute", top: 5, right: 5 }}>
                    <IconBtn
                        variant="text"
                        type="button"
                        Icon={EditIcon}
                        iconPosition={ICON_ONLY}
                        title="Change Setting Profile"
                        onClick={event =>
                            setSettingMenuAnchorElement(event.currentTarget)
                        }
                    />
                </div>
                <SettingMenu
                    anchorElement={settingMenuAnchorElement}
                    onClose={() => setSettingMenuAnchorElement(null)}
                    onChange={settingName => {
                        setSettingName(settingName);
                        setSettingMenuAnchorElement(null);
                    }}
                    settings={settings}
                />
                <Form onSubmit={onSubmit}>
                    <TextInput
                        label="Report No."
                        placeholder="e.g. 123456789-T"
                        name="report_no"
                        value={fields.report_no}
                        errors={errors}
                        onChange={onChange}
                        fullWidth
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
                    <TextInputWithCheckbox
                        label="Labeled Age Grade (Optional)"
                        placeholder="e.g. 6 years old and over"
                        name="labeled_age_grade"
                        value={fields.labeled_age_grade}
                        checkName="check_labeled_age_grade"
                        checked={fields.check_labeled_age_grade}
                        errors={errors}
                        onChange={onChange}
                        fullWidth
                    />
                    <TextInputWithCheckbox
                        label="Age Grade (Optional)"
                        placeholder="e.g. 6 years old and over"
                        name="age_grade"
                        value={fields.age_grade}
                        checkName="check_age_grade"
                        checked={fields.check_age_grade}
                        errors={errors}
                        onChange={onChange}
                        fullWidth
                    />
                    <TextInputWithCheckbox
                        label="Client Specified Testing Age Grade (Optional)"
                        placeholder="e.g. 6 years old and over"
                        name="client_specified_testing_age_grade"
                        value={fields.client_specified_testing_age_grade}
                        checkName="check_client_specified_testing_age_grade"
                        checked={
                            fields.check_client_specified_testing_age_grade
                        }
                        errors={errors}
                        onChange={onChange}
                        fullWidth
                    />
                    <Divider />
                    <TextInput
                        label="Product Name"
                        placeholder="e.g. Toy Chop 2 Piece Set"
                        name="product_names"
                        value={fields.product_names}
                        errors={errors}
                        onChange={onChange}
                        repeatable
                        fullWidth
                    />
                    <TextInputWithCheckbox
                        label="Item No. (Optional)"
                        placeholder="e.g. 65432"
                        name="item_nos"
                        value={fields.item_nos}
                        checkName="check_item_nos"
                        checked={fields.check_item_nos}
                        errors={errors}
                        onChange={onChange}
                        repeatable
                    />
                    <DropdownInput
                        label="Country of Origin"
                        name="country_of_origin"
                        value={fields.country_of_origin}
                        options={countryOfOriginOptions}
                        errors={errors}
                        onChange={onChange}
                    />
                    <Divider />
                    <TextInput
                        label="Applicant Client Name"
                        placeholder="e.g. BANPRESTO (HK) LTD."
                        name="applicant_name"
                        value={fields.applicant_name}
                        errors={errors}
                        onChange={onChange}
                        autoComplete={useMemo(
                            () => ({
                                suggestions: dataSet.applicant.map(
                                    applicant => ({
                                        label: applicant.name
                                    })
                                )
                            }),
                            [dataSet]
                        )}
                        data={{
                            trigger: reduceOnData(
                                dataSet.applicant,
                                (accumulated, applicant, changedFields) => {
                                    if (
                                        applicant.name ===
                                        changedFields.applicant_name
                                    ) {
                                        return pipe(
                                            resetIfApplicantNotMatch(
                                                dataSet.buyer,
                                                fields,
                                                "buyer"
                                            ),
                                            resetIfApplicantNotMatch(
                                                dataSet.manufacturer,
                                                fields,
                                                "manufacturer"
                                            )
                                        )({
                                            ...accumulated,
                                            applicant_address: applicant.address
                                        });
                                    }

                                    return accumulated;
                                }
                            )
                        }}
                        fullWidth
                    />
                    <TextInput
                        label="Applicant Address"
                        name="applicant_address"
                        value={fields.applicant_address}
                        errors={errors}
                        onChange={onChange}
                        fullWidth
                    />
                    <Divider />
                    <TextInput
                        label="Manufacturer Name"
                        placeholder="e.g. Hua Lun Toys MFG. Ltd"
                        name="manufacturer_name"
                        value={fields.manufacturer_name}
                        errors={errors}
                        onChange={onChange}
                        autoComplete={useMemo(
                            () => ({
                                suggestions: dataSet.manufacturer
                                    .filter(manufacturer => {
                                        return (
                                            !fields.applicant_name ||
                                            manufacturer.applicant ===
                                                fields.applicant_name
                                        );
                                    })
                                    .map(manufacturer => ({
                                        label: manufacturer.name,
                                        tags: [manufacturer.applicant]
                                    }))
                            }),
                            [dataSet, fields.applicant_name]
                        )}
                        data={{
                            trigger: reduceOnData(
                                dataSet.manufacturer,
                                (accumulated, manufacturer, changedFields) => {
                                    if (
                                        manufacturer.name ===
                                        changedFields.manufacturer_name
                                    ) {
                                        return {
                                            ...accumulated,
                                            manufacturer_address:
                                                manufacturer.address
                                        };
                                    }
                                    return accumulated;
                                }
                            )
                        }}
                        fullWidth
                    />
                    <TextInput
                        label="Manufacturer Address"
                        name="manufacturer_address"
                        value={fields.manufacturer_address}
                        errors={errors}
                        onChange={onChange}
                        fullWidth
                    />
                    <Divider />
                    <TextInput
                        label="Buyer/Importer Name"
                        placeholder="e.g. BANPRESTO CO., LTD"
                        name="buyer_name"
                        value={fields.buyer_name}
                        errors={errors}
                        onChange={onChange}
                        autoComplete={useMemo(
                            () => ({
                                suggestions: dataSet.buyer
                                    .filter(buyer => {
                                        return (
                                            !fields.applicant_name ||
                                            buyer.applicant ===
                                                fields.applicant_name
                                        );
                                    })
                                    .map(buyer => ({
                                        label: buyer.name,
                                        tags: [buyer.applicant]
                                    }))
                            }),
                            [dataSet, fields.applicant_name]
                        )}
                        data={{
                            trigger: reduceOnData(
                                dataSet.buyer,
                                (accumulated, buyer, changedFields) => {
                                    if (
                                        buyer.name === changedFields.buyer_name
                                    ) {
                                        return {
                                            ...accumulated,
                                            buyer_address: buyer.address
                                        };
                                    }
                                    return accumulated;
                                }
                            )
                        }}
                        fullWidth
                    />
                    <TextInput
                        label="Buyer/Importer Address"
                        name="buyer_address"
                        value={fields.buyer_address}
                        errors={errors}
                        onChange={onChange}
                        fullWidth
                    />
                    <Divider />
                    <TextInputWithCheckbox
                        label="Test Requested (Optional)"
                        placeholder="e.g. xxxx"
                        name="tests"
                        value={fields.tests}
                        checkName="check_tests"
                        checked={fields.check_tests}
                        errors={errors}
                        onChange={onChange}
                        autoComplete={testRequestedAutoComplete}
                        repeatable
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
            <Page elevation={4}>
                <Typography align="center" variant="h5" component="h1">
                    Latest Downloads{" "}
                    {successStack.length ? (
                        <IconBtn
                            title="Clean up the list"
                            variant="text"
                            Icon={DeleteIcon}
                            iconPosition={ICON_ONLY}
                            onClick={onRemoveStack}
                        />
                    ) : null}
                </Typography>
                {successStack.length ? (
                    successStack.map(success => (
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
                    ))
                ) : (
                    <Typography
                        align="center"
                        variant="body2"
                        component="div"
                        fontWeight="fontWeightLight"
                        color="textSecondary"
                    >
                        No Records at this moment...
                    </Typography>
                )}
            </Page>
        </Fragment>
    );
}

export default withSnackbar(App);
