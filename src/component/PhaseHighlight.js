import React, { forwardRef, memo } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    root: {

    },
    highlight: {
        color: theme.palette.secondary.light,
        fontWeight: 500
    }
});

const PhaseHighlight = forwardRef(
  ({ highlight, children, classes}, ref) => {
    if (!highlight)
      return (
        <span ref={ref} className={classes.root}>
          {children}
        </span>
      );

    let trimedHighlight = highlight.trim();
    if (!trimedHighlight)
      return (
        <span ref={ref} className={classes.root}>
          {children}
        </span>
      );

    const length = trimedHighlight.length;
    const regEx = new RegExp(trimedHighlight.toLowerCase().replace(/\\/g, "\\\\"), "gi");
    const chunks = [];
    let target = children;
    let idx;
    do {
      idx = target.search(regEx);
      if (idx === -1) break;
      if (0 === idx) {
        chunks.push({
          highlight: true,
          val: target.slice(0, length)
        });
      } else {
        chunks.push({
          highlight: false,
          val: target.slice(0, idx)
        });
        chunks.push({
          highlight: true,
          val: target.slice(idx, idx + length)
        });
      }
      target = target.slice(idx + length);
    } while (target);

    if (!chunks.length)
      return (
        <span ref={ref} className={classes.root}>
          {children}
        </span>
      );

    if (target) {
      chunks.push({
        highlight: false,
        val: target
      });
    }

    return (
      <span ref={ref} className={classes.root}>
        {chunks.map((chunk, idx) => (
          <span
            key={`${idx}-${chunk.val}`}
            className={chunk.highlight ? classes.highlight : ""}
          >
            {chunk.val}
          </span>
        ))}
      </span>
    );
  }
);

PhaseHighlight.propTypes = {
  children: PropTypes.string,
  highlight: PropTypes.string,
  /** Class Modifiers. Must be an array of string */
  modifiers: PropTypes.array
};

export default memo(withStyles(styles)(PhaseHighlight));
