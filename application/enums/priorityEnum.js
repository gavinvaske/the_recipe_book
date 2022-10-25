const RUSH_FEE = 'Rush Fee';
const RE_RUN = 'ReRun';
const HOT = 'Hot';
const STANDARD = 'Standard';

module.exports.standardPriority = STANDARD;

module.exports.getAllPriorities = () => {
    return [
        RUSH_FEE,
        RE_RUN,
        HOT,
        STANDARD
    ];
};