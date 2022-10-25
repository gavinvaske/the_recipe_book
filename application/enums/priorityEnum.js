const RUSH_FEE = 'Rush Fee';
const RE_RUN = 'ReRun';
const HOT = 'Hot';
const STANDARD = 'Standard';

module.exports.rushFeePriority = RUSH_FEE;
module.exports.reRunPriority = RE_RUN;
module.exports.hotPriority = HOT;
module.exports.standardPriority = STANDARD;

module.exports.getAllPriories = () => {
    return [
        RUSH_FEE,
        RE_RUN,
        HOT,
        STANDARD
    ];
};