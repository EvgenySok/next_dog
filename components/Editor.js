import React, { useEffect } from "react"
import { Editor } from '@tinymce/tinymce-react'
import Head from "next/head"
import { postData } from "../secondary-functions/requests"
const Compress = require('compress.js')

const EditorComponent = ({ handleEditorChange }) => {

  const compress = new Compress()

  useEffect(() => {
    const observer = new MutationObserver(async function (mutationsList, observer) {
      const linkPoweredByTiny = document.querySelector('[aria-label="Powered by Tiny"]')
      if (linkPoweredByTiny) {
        linkPoweredByTiny.remove()
        observer.disconnect()
        return
      }
    })
    observer.observe(document, {
      characterData: true,
      childList: true,
      subtree: true
    })
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Editor
        apiKey="7a53gu408leuknbz8st16j4h5o4r2tuka7c6n0j6e8ny42sx"
        selector='textarea#classic'
        initialValue=""
        init={{
          convert_urls: false,
          images_upload_credentials: true,
          images_reuse_filename: true,
          images_upload_url: 'api/upload/picture',
          images_upload_handler: async function (blobInfo, success, failure) {
            const compressedFile = await compress.compress([blobInfo.blob()], {  quality: 0.8 })
            const res = await postData({
              base64: compressedFile[0].data,
              type: blobInfo.blob().type,
              filename: blobInfo.filename(),
            }, 'api/upload/picture')
            success(res.fileUrl)
            return
          },
          width: 755,
          height: 500,
          resize: false,
          autosave_ask_before_unload: false,
          powerpaste_allow_local_images: true,
          plugins: [
            'a11ychecker advcode advlist anchor autolink codesample fullscreen help image imagetools',
            ' lists link media noneditable powerpaste preview autosave'
          ],
          toolbar:
            'insertfile a11ycheck undo redo | bold italic | forecolor backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist | link image tinydrive',
          spellchecker_dialog: true,
          spellchecker_whitelist: ['Ephox', 'Moxiecode'],
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

          //autosave
          autosave_interval: '3s',
          autosave_restore_when_empty: true,
          autosave_retention: '525600m',
          autosave_prefix: 'tinymce-autosave-{path}{query}',
        }}

        onEditorChange={handleEditorChange}

      />
    </>
  )
}



export default EditorComponent