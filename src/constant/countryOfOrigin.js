export const CHINA = "CHINA";
export const HONG_KONG = "HONG KONG(CHINA)";

const all = [CHINA, HONG_KONG];

export const options = all.reduce(
    (options, cor) => ({
        ...options,
        [cor]: cor
    }),
    {}
);

export default all;
