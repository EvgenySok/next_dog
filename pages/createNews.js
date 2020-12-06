import React from "react";
import dynamic from 'next/dynamic'
import { withIronSession } from "next-iron-session";
import { ironSessionParam } from "../utils/iron-session";
import Head from "next/head";
import sanitizeHtml from 'sanitize-html'

const CreateNews = ({ user }) => {
  const handleEditorChange = (content, editor) => {
    console.log('Content was updated:', content);
    console.log('editor:', sanitizeHtml(editor));
  }

  const Editor = dynamic(() => import('../components/Editor.js'),
    { ssr: false })

  return (
    <>
      <Head>

      </Head>
      <div>

        <h1>Create News</h1>

        <Editor handleEditorChange={handleEditorChange} />

      </div>
    </>
  )
}

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get("user") ? req.session.get("user") : null

    if (!user) {
      res.statusCode = 404
      res.end()
    }

    return {
      props: { user }
    }
  }, ironSessionParam)

export default CreateNews