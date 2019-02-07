module.exports = (length = 32) => {
    const UIDGenerator = require("uid-generator");
    const uidgen = new UIDGenerator(null, UIDGenerator.BASE62, length);
    return uidgen.generateSync();
};
