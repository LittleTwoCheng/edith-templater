import React from "react";
import Input from "./Input";
import AutoComplete from "./AutoComplete";

export default ({ autoComplete = null, ...props }) =>
    autoComplete && autoComplete.suggestions.length ? (
        <AutoComplete autoComplete={autoComplete} {...props} />
    ) : (
        <Input {...props} type="text" />
    );
