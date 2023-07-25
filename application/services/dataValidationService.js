const PHONE_VALIDATION_REGEX = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
const EMAIL_VALIDATION_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

module.exports.validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return true;

    return PHONE_VALIDATION_REGEX.test(phoneNumber);
};

module.exports.validateEmail = (email) => {
    if (!email) return true;

    return EMAIL_VALIDATION_REGEX.test(email);
};