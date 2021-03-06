import createTemplate from "./createTemplate";
import massageFields, { DATE, UPPER_CASE, CUSTOM } from "./massageFields";

import { compose as composeValidate, SCHEMAS } from "../form/validate";

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
      minLength: 1,
      maxLength: 100
    }),
    age_grade: SCHEMAS.STRING({
      minLength: 1,
      maxLength: 100
    }),
    client_specified_testing_age_grade: SCHEMAS.STRING({
      minLength: 1,
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
    product_names: {
      type: "array",
      minItems: 1,
      items: SCHEMAS.STRING({
        minLength: 1,
        maxLength: 9999
      })
    },
    item_nos: {
      type: "array",
      minItems: 1,
      items: SCHEMAS.STRING({
        minLength: 1
      })
    },
    country_of_origin: SCHEMAS.STRING({
      minLength: 1,
      maxLength: 999
    }),
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
    }),
    supplier_name: SCHEMAS.STRING({
      minLength: 1,
      maxLength: 999
    }),
    supplier_address: SCHEMAS.STRING({
      minLength: 1,
      maxLength: 9999
    }),
    tests: {
      type: "array",
      minItems: 1,
      items: SCHEMAS.STRING({
        minLength: 1,
        maxLength: 999
      })
    },
    involed_divisions: {
      type: "array",
      items: SCHEMAS.STRING({
        minLength: 1,
        maxLength: 999
      })
    },
    is_retest: {
      type: "boolean"
    },
    retest_date: SCHEMAS.DATE()
  },
  optional: [
    "labeled_age_grade",
    "age_grade",
    "client_specified_testing_age_grade",
    "item_nos",
    "supplier_name",
    "supplier_address",
    "tests"
  ],
  required: [
    "report_no",
    "acceptance_date",
    "report_delivery_date",
    "applicant_name",
    "applicant_address",
    "product_names",
    "country_of_origin",
    "manufacturer_name",
    "manufacturer_address",
    "buyer_name",
    "buyer_address",
    "is_retest",
    "retest_date"
  ]
});

const massageList = (fields, name) => {
  if (!fields[name] || !fields[name].length) {
    return fields;
  }

  fields[name] = fields[name].filter(item => {
    return item && item.length > 0;
  });
  return fields;
};

const formMessageMapping = {
  acceptance_date: DATE(),
  report_delivery_date: DATE(),
  retest_date: DATE(),
  product_names: CUSTOM(massageList),
  item_nos: CUSTOM(massageList),
  tests: CUSTOM(massageList),
  applicant_address: UPPER_CASE(),
  manufacturer_address: UPPER_CASE(),
  buyer_address: UPPER_CASE(),
  supplier_address: UPPER_CASE()
};

export default ({ settingName, template_name, ...fields }) => {
  console.log("submit", {
    fields,
    template_name,
    path: __static + `/${settingName}/templates/${template_name}`
  });
  validateForm(fields);

  return createTemplate(
    massageFields(fields, formMessageMapping),
    app.getPath("downloads"),
    __static + `/${settingName}/templates/${template_name}`,
    `Report_${fields.report_no}_`
  );
};
