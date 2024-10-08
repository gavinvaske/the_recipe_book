const SEMI_GLOSS = 'SEMI GLOSS';
const WHITE_BOPP = 'WHITE BOPP';
const SILVER = 'SILVER';
const CLEAR = 'CLEAR';

export const hotFolders = {
    '9111': SEMI_GLOSS,
    '9124': SEMI_GLOSS,
    '9122': SEMI_GLOSS,
    '9134': SEMI_GLOSS,
    '9091': SEMI_GLOSS,
    '9092': SEMI_GLOSS,
    '9037': SEMI_GLOSS,
    '9052': SEMI_GLOSS,
    '9056P': SEMI_GLOSS,
    '9057': SEMI_GLOSS,
    '9065': SEMI_GLOSS,
    '9099': SEMI_GLOSS,
    '9063': SEMI_GLOSS,
    '9146': SEMI_GLOSS,

    '9109': SEMI_GLOSS,

    '9039': WHITE_BOPP,
    '9093': WHITE_BOPP,
    '9078': WHITE_BOPP,
    '9100': WHITE_BOPP,
    '9006': WHITE_BOPP,
    '9012': WHITE_BOPP,
    '9028': WHITE_BOPP,
    '9035': WHITE_BOPP,
    '9040': WHITE_BOPP,
    '9225': WHITE_BOPP,
    '167': WHITE_BOPP,
    '9401': WHITE_BOPP,

    '9135': SILVER,
    '9022': SILVER,
    '166': SILVER,

    '9049': SILVER,

    '9048': SILVER,
    '9051': SILVER,
    '9062': SILVER,

    '9020': CLEAR,
    '9121': CLEAR,
    '9241': CLEAR,
    '9010': CLEAR,
    '9016': CLEAR,
    '9007': CLEAR,

    '9137': SEMI_GLOSS,
    '9139': SEMI_GLOSS,
    '9150': SEMI_GLOSS,
    '9155': SEMI_GLOSS,
    '151': SEMI_GLOSS,
    '9152': SEMI_GLOSS,
    '9159': SEMI_GLOSS,
    '9160': SEMI_GLOSS,
    '9050': SEMI_GLOSS,
    '451': SEMI_GLOSS,
    '9141': SEMI_GLOSS,

    '9087': SEMI_GLOSS,
    '9143': SEMI_GLOSS,

    '9042': SILVER,

    '9018': SEMI_GLOSS,
    '9025': SEMI_GLOSS,
    '9045': SEMI_GLOSS,
    '9400A': SEMI_GLOSS,

    '9047': SEMI_GLOSS,
    '9148': SEMI_GLOSS,
    '9149': SEMI_GLOSS,

    '175': SEMI_GLOSS,
    '200': SEMI_GLOSS,
    '9066': SEMI_GLOSS
};

export function getUniqueHotFolders() {
    const hotFoldersAsASet = new Set(Object.values(hotFolders));
    return [...hotFoldersAsASet];
}