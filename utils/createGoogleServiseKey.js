import * as fs from 'fs'
import { resolve } from 'path'

export const pathGoogleKey = resolve('./', 'service-account-key.json')

export const dir = 'tmp'

export default async function createKeyJson() {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    if (fs.existsSync(pathGoogleKey)) {
      return
    }
    const credential = Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString()

    await fs.writeFile(pathGoogleKey, credential, 'utf8', (err) => {
      if (err) throw err
    })
    return
  } catch (error) {
    return error
  }

}