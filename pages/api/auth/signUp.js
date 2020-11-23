const bcrypt = require('bcryptjs')
const shortid = require('shortid')

import Candidate from '../../../models/Candidate'
import User from '../../../models/User'

import dbConnect from '../../../utils/dbConnect'
import sendMailToCompleteRegistration from '../../../utils/mailgun/confirmationEmail'
import { SignupValidateSchema } from '../../../validate/authValidate'

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
      let newCandidate = {}
      try {

        const validateErrors = await SignupValidateSchema.validate(req.body, { abortEarly: false })
          .then(() => null)
          .catch((err) => {
            const errorsForFormik = err.inner.reduce((acc, it) => ({ ...acc, [it.path]: it.errors.join(' ') }), {})
            return errorsForFormik
          })

        if (validateErrors) {
          return res.status(403).json(validateErrors)
        }

        const { email, password } = req.body

        const candidate = await Candidate.findOne({ email })
        const user = await User.findOne({ email })
        if (user) {
          return res.status(400).json({ error: 'This user already exists' })
        }
        if (candidate) {
          return res.status(400).json({ error: 'An email has already been sent to this email address to confirm registration.' })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        let secretLinc = await bcrypt.hash(shortid.generate(), 12)
        secretLinc = [...secretLinc].filter((it) => it !== '/').join('')

        newCandidate = new Candidate({ secretLinc, email, password: hashedPassword })
        await newCandidate.save()
        console.log('newCandidate:', newCandidate)


        const temporaryLinc = `${process.env.URL}/api/auth/${secretLinc}`

        const result = await sendMailToCompleteRegistration(email, temporaryLinc)

        res.status(201).json({ success: 'User created. To complete the resistance, follow the link in the mail.' })
      } catch (error) {

        if (newCandidate) {
          await Candidate.findByIdAndRemove(newCandidate.id)
        }
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