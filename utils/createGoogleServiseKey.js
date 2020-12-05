import * as fs from 'fs'
import { resolve } from 'path'

export default async function createKeyJson() {
  if (fs.existsSync(resolve('./service-account-key.json'))) {
    return
  }
  const credential = Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString()
  
  await fs.writeFile(resolve('./service-account-key.json'), credential, 'utf8', (err) => {
    if (err) throw err
  })
  return
}