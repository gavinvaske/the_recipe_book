import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function sendPasswordResetEmail(emailAddress, resetLink) {
  const msg = {
    to: emailAddress,
    from: 'Gavin.Vaske@gmail.com',
    subject: 'Reset your "E.L.I" Account Password',
    text: `Click or Copy-and-paste the following url into your browser to reset your password: ${resetLink}`,
  }

  await sgMail.send(msg)

}