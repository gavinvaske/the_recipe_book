const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const ticketSchema = require('./ticket').schema;
const dieLineCardSchema = require('../schemas/dieLineCard');
const spotPlateCardSchema = require('../schemas/spotPlateCard');

function performXor(a, b, c) {
    return Boolean(a) ^ Boolean(b) ^ Boolean(c);  // https://stackoverflow.com/a/55865183
}

const cardSchema = new Schema({
    ticket: {
        type: ticketSchema,
        required: false
    },
    dieLine: {
        type: dieLineCardSchema,
        required: false
    },
    spotPlate: {
        type: spotPlateCardSchema,
        required: false
    }
}, { timestamps: true });


cardSchema.pre('validate', function(next) {
    const onlyOneAttributeIsDefined = performXor(this.ticket, this.dieLine, this.spotPlate);

    if (!onlyOneAttributeIsDefined) {
        return next(new Error('Error: A card must have one and only one of the following attributes: "ticket" or "dieLine" or "spotPlate".'));
    }

    return next();
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;