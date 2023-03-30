module.exports.getEmptyObjectIfUndefined = (value) => {
    return value ? value : {};
}

module.exports.getEmptyArrayIfUndefined = (array) => {
    return array ? array : [];
}