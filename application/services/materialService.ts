export function getMaterialIds(materials) {
    return materials.map(({materialId}) => {
        return materialId;
    });
}