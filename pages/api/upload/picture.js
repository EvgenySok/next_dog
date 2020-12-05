import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import dbConnect from '../../../utils/dbConnect';
import createKeyJson, { pathGoogleKey } from '../../../utils/createGoogleServiseKey';

const { Storage } = require('@google-cloud/storage');

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
        const { base64, type, filename } = req.body;
        const img = Buffer.from(base64, 'base64');
        const temp_filepath = path.join(os.tmpdir(), filename); 

        await fs.outputFile(temp_filepath, img, (err) => {
          if (err) throw err
        })

        const storage = new Storage({ projectId: 'next-dog-509c7', keyFilename: pathGoogleKey });
        const bucket = storage.bucket(bucketName);

        await bucket.upload(temp_filepath, {
          metadata: {
            contentType: `${type}`,
            metadata: {
              firebaseStorageDownloadTokens: uuid,
            },
          },
        }, (err, file) => {
          if (err) throw err;
        });

        fs.unlinkSync(temp_filepath)
        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${filename}?alt=media&token=${uuid}`;
        res.json({ fileUrl });
      } catch (error) {
        res.status(400).json({ success4: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
