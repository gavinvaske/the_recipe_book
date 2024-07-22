import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const client = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
});

export async function sendPasswordResetEmail(emailAddress, resetLink) {
    if (!emailAddress || !resetLink) {
        throw Error(`emailAddress and reset-link must both be defined: ${emailAddress}, ${resetLink}`);
    }

    const messageData = {
        from: 'The Label Factory <storm@labelAdvantage.com>',
        to: emailAddress,
        subject: 'Reset your "Recipe Book" Password',
        text: `Copy and paste the following url into your browser to reset your password: ${resetLink}`
    };

    try {
        await client.messages.create(process.env.MAILGUN_DOMAIN, messageData);
    } catch (error) {
        console.log(`Error occurred while trying to send email via MAILGUN: ${error}`);
    }
}