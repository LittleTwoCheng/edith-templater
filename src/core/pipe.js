const _pipe = (fn1, fn2) => (...arg) => fn2(fn1(...arg));
export default (...ops) => ops.reduce(_pipe);
