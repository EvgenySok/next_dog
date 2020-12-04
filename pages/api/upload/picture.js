import dbConnect from '../../../utils/dbConnect'
const { Storage } = require('@google-cloud/storage')

import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs-extra'

const UUID = require("uuid-v4")
let uuid = UUID()

export default async function handler(req, res) {
  const { method } = req
  await dbConnect()

  switch (method) {
    case 'POST':
      try {
        console.log('req.socket.bytesRead', req.socket.bytesRead)
        const { base64, type, filename } = req.body
        const img = Buffer.from(base64, 'base64')
        const temp_filepath = path.join(os.tmpdir(), filename);
        await fs.outputFile(temp_filepath, img, {});
        
        const storage = new Storage({ projectId: 'next-dog-509c7', keyFilename: "./next-dog-85dc29690db4.json" })
        const bucketName = 'next-dog-509c7.appspot.com'
        const bucket = storage.bucket(bucketName)

        await bucket.upload(temp_filepath, {
          predefinedAcl: 'publicRead',
          metadata: {
            contentType: `${type}`,
            metadata: {
              firebaseStorageDownloadTokens: uuid
            }
          }
        })

        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${filename}?alt=media&token=${uuid}`
        // console.log(fileUrl)
        res.json({ fileUrl })
      } catch (error) {
        res.status(400).json({ success4: false, error })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
