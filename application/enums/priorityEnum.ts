const RUSH_FEE = 'Rush';
const RE_RUN = 'ReRun';
const HOT = 'Hot';
const STANDARD = 'Standard';

export const standardPriority = STANDARD;

export function getAllPriorities() {
    return [
        RUSH_FEE,
        RE_RUN,
        HOT,
        STANDARD
    ];
}