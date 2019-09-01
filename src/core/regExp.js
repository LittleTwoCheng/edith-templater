const safeRegExp = (pattern, flags = "gi") => {
  return new RegExp(
    `${pattern
      .toLowerCase()
      .replace(/[!$^*()\-+[\]|:?]/g, "")
      .replace(/\\/g, "\\\\")}`,
    flags
  );
};
export { safeRegExp };
