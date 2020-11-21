const bcrypt = require('bcryptjs')
const shortid = require('shortid')

import Candidate from '../../../models/Candidate'
import User from '../../../models/User'

import dbConnect from '../../../utils/dbConnect'
import sendMailToCompleteRegistration from '../../../utils/mailgun/confirmationEmail'

export default async function handler(req, res) {
  const { method } = req
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
      } catch (error) {
      }
      break
    case 'POST':
      try {
        const { email, password } = req.body

        const candidate = await Candidate.findOne({ email })
        const user = await User.findOne({ email })
        if (user) {
          return res.status(400).json([{ msg: 'This user already exists', param: 'email' }])
        }
        if (candidate) {
          return res.status(400).json([{ msg: 'An email has already been sent to this email address to confirm registration.', param: 'email' }])
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        let secretLinc = await bcrypt.hash(shortid.generate(), 12)
        secretLinc = [...secretLinc].filter((it) => it !== '/').join('')

        const newCandidate = await Candidate.create({ secretLinc, email, password: hashedPassword, })

        const temporaryLinc = `${process.env.URL}/api/auth/${secretLinc}`

        await sendMailToCompleteRegistration(email, temporaryLinc)

        res.status(201).json({ msg: 'User created. To complete the resistance, follow the link in the mail.', param: 'success' })
      } catch (error) {
        res.status(500).json([{
          msg: 'Error while registering user on the server.',
          error: error.message
        }])
      }
      break
    default:
      res.status(500).json(new Error('Request not defined.'))
      break
  }
}