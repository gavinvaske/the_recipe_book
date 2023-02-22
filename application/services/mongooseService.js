module.exports.parseHumanReadableMessages = (error) => {
    let humanReadableMessages = [];

    if (error.message) {
        return [error.message];
    }

    try {
        const {errors} = error;

        Object.keys(errors).forEach((key) => {
            const mongooseError = errors[key];
            const errorType = mongooseError['name'];
            let humanReadableMessage;

            if (errorType === 'ValidatorError') {
                humanReadableMessage = `'${mongooseError['path']}' failed validation: ${mongooseError['message']}`;
            } else {
                humanReadableMessage = `'${errorType}': ${mongooseError['message']}`;
            }
            humanReadableMessages.push(humanReadableMessage);
        });

        return humanReadableMessages;
    } catch (error) {
        console.log(`Error parse error: ${JSON.stringify(error)}`);
        return ['Uh oh, an unknown error occurred, please contact the IT department.'];
    }
};