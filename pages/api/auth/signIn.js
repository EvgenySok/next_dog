import { withIronSession } from "next-iron-session"
import { serialize } from 'cookie'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

import dbConnect from '../../../utils/dbConnect'

import User from "../../../models/User"
import { ironSessionParam } from "../../../utils/iron-session"
import { SigninValidateSchema } from "../../../validate/authValidate"

export default withIronSession(
  async (req, res) => {
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
          const validatedData = await SigninValidateSchema.validate(req.body, { abortEarly: false })

          const { email, password } = validatedData

          const user = await User.findOne({ email })

          if (!user) {
            return res.status(403).json({ error: 'Is at least one field filled in incorrectly' })
          }

          const isMatch = await bcrypt.compare(password, user.password)

          if (!isMatch) {
            return res.status(403).json({ error: 'Is at least one field filled in incorrectly' })
          }

          //========= set Cookie =========
          // setHeader(headerName: string, cookies: string | string[])
          // can use array for multiple cookies
          const jwt_payload = { userId: user.id }
          const token = jwt.sign(jwt_payload, process.env.SECRET_JWT, { expiresIn: '48h' })
          await res.setHeader('Set-Cookie', serialize('token', token, { path: '/', maxAge: (60 * 60 * 24) * 2 }))
          //========= set Cookie =========

          req.session.set("user", { email }) // add data here


          await req.session.save().catch(err => {
          console.log('err', err)
            
          })


          return res.status(201).json({ success: 'Login successful.' })

        } catch (error) {

          if (error.name === 'ValidationError') {
            const errorsForFormik = error.inner.reduce((acc, it) => ({ ...acc, [it.path]: it.errors.join(' ') }), {})
            return res.status(403).json(errorsForFormik)
          }

          res.status(403).json([{
            msg: 'Error while sign in user on the server.',
            param: 'error',
            error: error.message,
            error,
          }])
        }
        break
      default:
        res.status(404).json(new Error('Request sign in not defined.'))
        break
    }
  },
  ironSessionParam
);