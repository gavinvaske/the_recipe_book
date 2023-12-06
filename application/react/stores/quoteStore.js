import { makeAutoObservable, autorun } from 'mobx';

const NUMBER_OF_QUOTES = 8;
const DEFAULT_LABEL_QUANTITY = 0;
const DEFAULT_QUOTE = {};

function initializeLabelQuantities(numberOfQuotes) {
    return Array.from({length: numberOfQuotes}, (_, i) => DEFAULT_LABEL_QUANTITY) // https://stackoverflow.com/a/33352604
}

function initializeQuotes(numberOfQuotes) {
    return Array.from({length: numberOfQuotes}, (_, i) => DEFAULT_QUOTE)  // https://stackoverflow.com/a/33352604
}

class quoteStore {
    quoteInputs = {
        labelQuantities: initializeLabelQuantities(NUMBER_OF_QUOTES),
        dieOverride: {},
        primaryMaterialOverride: {},
        secondaryMaterialOverride: {}
    }
    quotes = initializeQuotes(NUMBER_OF_QUOTES);
}

let store = window.store = new quoteStore();

export default makeAutoObservable(store);

autorun(() => {
    console.log(store.quoteInputs);
});