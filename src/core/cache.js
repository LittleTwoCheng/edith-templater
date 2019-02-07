const get = (name, defaultValue) => {
    const val = window.localStorage.getItem(name);
    if (val === null) return defaultValue;

    try {
        return JSON.parse(val);
    } catch (e) {
        console.error(e);
        return defaultValue;
    }
};

const set = (name, value) => {
    try {
        window.localStorage.setItem(name, JSON.stringify(value));
    } catch (e) {
        console.error(e);
    }
};

export { get, set };
