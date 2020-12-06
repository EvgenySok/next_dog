import * as path from 'path';
// import * as fs from 'fs-extra';
import * as fs from 'fs'
import dbConnect from '../../../utils/dbConnect';
import createKeyJson, { dir, pathGoogleKey } from '../../../utils/createGoogleServiseKey';

const { Storage } = require('@google-cloud/storage');
const shortid = require('shortid')
const UUID = require('uuid-v4')

export default async function handler(req, res) {
  const uuid = UUID()
  const bucketName = 'next-dog-509c7.appspot.com'
  const { method } = req
  await dbConnect();
  await createKeyJson()

  switch (method) {
    case 'POST':
      try {
        console.log('req.socket.bytesRead', req.socket.bytesRead);// add check for size
        const { base64, type, filename } = req.body
        const img = Buffer.from(base64, 'base64')
        const rundomFileName = shortid.generate() + filename.slice(-4)
        const temp_filepath = path.resolve(dir, rundomFileName)

        fs.writeFileSync(temp_filepath, img, (err) => {
          if (err) throw new Error('fs.outputFile', err)
        })

        const storage = new Storage({ projectId: 'next-dog-509c7', keyFilename: pathGoogleKey });
        const bucket = storage.bucket(bucketName)
        bucket.upload(path.join( dir, rundomFileName), {
          metadata: {
            contentType: `${type}`,
            metadata: {
              firebaseStorageDownloadTokens: uuid,
            },
          },
        }, (err, file) => {
            if (err) { 
              res.status(400).json({ message: 'bucket.upload', err })
            }
            fs.unlinkSync(temp_filepath)
            const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${rundomFileName}?alt=media&token=${uuid}`;
            res.json({ fileUrl })

        })
      } catch (error) {
        res.status(400).json({ success4: false, error })
      }
      break;
    default:
      res.status(400).json({ success: false })
      break;
  }
}
