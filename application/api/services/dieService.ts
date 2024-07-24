export function getCoreHeightFromDie(die) {
    const { sizeAcross } = die;
    const buffer = 0.125;

    return sizeAcross + buffer;
}