module.exports.sendPasswordResetEmail = (emailAddress, resetLink) => {
    if (!emailAddress || !resetLink) {
        throw Error(`emailAddress and reset-link must both be defined: ${emailAddress}, ${resetLink}`);
    }
};