import React, { Fragment } from "react";

export default ({ children }) => {
    const parts = children.split("\n");
    return parts.length === 1
        ? children
        : parts.map((part, idx) => (
              <Fragment key={idx}>
                  {part}
                  <br />
              </Fragment>
          ));
};
