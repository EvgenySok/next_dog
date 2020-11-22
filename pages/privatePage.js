import React from "react";
import { withIronSession } from "next-iron-session";
import { ironSessionParam } from "../utils/iron-session";

const PrivatePage = ({ user }) => (
  <div>
    <h1>Hello {user.email}</h1>
    <p>Secret things live here...</p>
  </div>
)

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

export default PrivatePage