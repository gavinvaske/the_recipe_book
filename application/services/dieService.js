module.exports.getCoreHeightFromDie = (die) => {
    const { sizeAcross } = die;
    const buffer = 0.125;

    return sizeAcross + buffer;
};