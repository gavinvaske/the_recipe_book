module.exports.getMaterialIds = (materials) => {
    return materials.map(({materialId}) => {
        return materialId;
    });
};