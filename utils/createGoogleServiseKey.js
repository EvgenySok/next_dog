import * as fs from 'fs'
import { join } from 'path'

export const pathGoogleKey = join('./', 'service-account-key.json')

export default async function createKeyJson() {
  try {
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