export const ironSessionParam =
{
  cookieName: "cookie",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: process.env.APPLICATION_SECRET
}
