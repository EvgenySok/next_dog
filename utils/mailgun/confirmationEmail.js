const { readFile } = require('fs').promises
const { resolve } = require('path')

const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = process.env

const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  host: 'api.eu.mailgun.net',
})

const sendMailToCompleteRegistration = async (mail, linc) => {
  const message = `To confirm registration, follow the link or ignore this message. ${linc}`
  const adresFile = resolve(process.cwd(), './utils/mailgun/confirmationEmail.html')

  const htmlTemplate = await readFile(adresFile, 'utf8')
  const html = htmlTemplate.replace(/%%URL%%/g, linc);

  const data = {
    from: 'Excited User <me@samples.mailgun.org>',
    to: mail,
    subject: 'Hello',
    text: message,
    html,
  }
  const result = await mailgun.messages().send(data)
  
  return result
  // return await mailgun.messages().send(data, (error, body) => {
  //   if (error) {
  //     console.log('mailgun error', error)
  //     return new Error('error on the server when sending an email')
  //   }
  //   console.log('mailgun success', body)
  //   return body
  // })
}

export default sendMailToCompleteRegistration