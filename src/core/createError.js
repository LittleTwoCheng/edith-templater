export default (msg, errors) => {
    const e = new Error(msg);
    e.getErrors = () => errors;

    return e;
};
