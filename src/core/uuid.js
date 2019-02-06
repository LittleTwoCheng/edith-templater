module.exports = () => {
    const UIDGenerator = require("uid-generator");
    const uidgen = new UIDGenerator(null, UIDGenerator.BASE62, 32);
    return uidgen.generateSync();
};
