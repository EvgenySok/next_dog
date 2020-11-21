import { withIronSession } from "next-iron-session"
import { ironSessionParam } from "../../../utils/iron-session";

async function handler(req, res) {
  // req.session.destroy();
  const cookie = req.cookies
  const headers = Object.keys(cookie).reduce((acc, name) => {
    acc.push(`${name}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`)
    return acc
  }, [])

  await res.setHeader("Set-Cookie", headers)

  res.redirect('/signIn')
}

export default withIronSession(handler, ironSessionParam)