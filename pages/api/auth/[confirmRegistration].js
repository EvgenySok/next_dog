
import Candidate from '../../../models/Candidate'
import User from '../../../models/User'

import dbConnect from '../../../utils/dbConnect'

export default async function handler(req, res) {
  const { method } = req
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const { query: { confirmRegistration } } = req
        const candidate = await Candidate.findOne({ secretLinc: confirmRegistration })

        if (candidate) {
          const { email, password } = candidate

          const user = new User({ email, password })

          await user.save()

          return res.status(201).redirect('/')
        }
        return res.status(500).json([{ msg: 'Registration error, invalid link or expired', param: 'link' }])

      } catch (error) {
        return res.status(500).json([{ msg: 'Registration confirmation error.', error: error.message }])
      }
      break
    case 'POST':
      try {

      } catch (error) {
      }
      break
    default:
      res.status(500).json(new Error('Request not defined.'))
      break
  }
}