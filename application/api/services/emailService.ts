import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function sendPasswordResetEmail(emailAddress: string, resetLink: string, minutesUntilExpiration: number) {
  const msg = {
    to: emailAddress,
    from: 'The Label Factory <storm@thelabelfactory.com>',
    subject: 'Reset your "E.L.I" Account Password',
    text: `Click the link to reset your password (this link will expire in ${minutesUntilExpiration} minutes):\n\n\n ${resetLink}`,
  }

  await sgMail.send(msg)

}