import { withIronSession } from "next-iron-session"
const { OAuth2Client } = require('google-auth-library')
import { serialize } from 'cookie'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

import dbConnect from '../../../utils/dbConnect'

import User from "../../../models/User"
import { ironSessionParam } from "../../../utils/iron-session"
import { SigninValidateSchema } from "../../../validate/authValidate"

export default async function handler(req, res) {

  const { method } = req
  await dbConnect()
  if (method === 'POST') {

    switch (req.body.provider) {
      case 'google':
        try {
          const { GoogleUserId_token } = req.body
          const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
          async function verify() {
            const ticket = await client.verifyIdToken({
              idToken: GoogleUserId_token,
              audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
            })
            const payload = ticket.getPayload()
            const userid = payload['sub']

            const { email, email_verified, given_name, family_name, picture } = payload
            console.log('user data from google:', { email, email_verified, given_name, family_name, picture })
            res.json({ ticket, payload, userid })
            // If request specified a G Suite domain:
            // const domain = payload['hd'];
          }
          
          await verify().catch(console.error)

        } catch (error) {
          res.status(403).json([{
            msg: `Error while OAuth on the server with ${req.body.provider}.`,
            error: error.message
          }])
        }
        break
        case 'facebook':
          try {
            const { FacebookUserId_token } = req.body
            const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
            async function verify() {
              const ticket = await client.verifyIdToken({
                idToken: GoogleUserId_token,
                audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
              })
              const payload = ticket.getPayload()
              const userid = payload['sub']
  
              const { email, email_verified, given_name, family_name, picture } = payload
              console.log('user data from google:', { email, email_verified, given_name, family_name, picture })
              res.json({ ticket, payload, userid })
              // If request specified a G Suite domain:
              // const domain = payload['hd'];
            }
            
            await verify().catch(console.error)
  
          } catch (error) {
            res.status(403).json([{
              msg: `Error while OAuth on the server with ${req.body.provider}.`,
              error: error.message
            }])
          }
          break
      default:
        res.status(404).json(new Error('Request OAuth not defined.'))
        break
    }
  }
}