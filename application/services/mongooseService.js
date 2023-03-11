module.exports.getObjectIds = (objects) => {
    return objects.map(({_id}) => {
        return _id;
    });
}

module.exports.parseHumanReadableMessages = (error) => {
    try {
        const aNonMongooseErrorOccurred = !error.errors && error.message;

        if (aNonMongooseErrorOccurred) {
            return [error.message];
        }

        let humanReadableMessages = [];
        const {errors} = error;

        Object.keys(errors).forEach((key) => {
            const mongooseError = errors[key];
            const errorType = mongooseError['name'];
            let humanReadableMessage;

            if (errorType === 'ValidatorError') {
                humanReadableMessage = `${mongooseError['message']}`;
            } else {
                humanReadableMessage = `'${errorType}': ${mongooseError['message']}`;
            }
            humanReadableMessages.push(humanReadableMessage);
        });

        return humanReadableMessages;
    } catch (error) {
        console.log(`Error: parse error in parseHumanReadableMessages: ${JSON.stringify(error)}`);
        return ['Uh oh, an unknown error occurred, please contact the IT department.'];
    }
};