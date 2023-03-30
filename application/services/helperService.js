module.exports.getEmptyObjectIfUndefined = (value) => {
    return value ? value : {};
};

module.exports.getEmptyArrayIfUndefined = (value) => {
    return value ? value : [];
};