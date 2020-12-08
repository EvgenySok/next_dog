import '../css/style.scss'
import Head from 'next/head'
import Link from 'next/link'

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Pet Care App</title>
      </Head>

      <div className="top-bar">
        <div className="nav">
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/new">
            <a>Add Pet</a>
          </Link>
          <Link href="/familyTree">
            <a>Family Tree</a>
          </Link>
          <Link href="/createNews">
            <a>Create news</a>
          </Link>
          <Link href="/signIn">
            <a>Sign In</a>
          </Link>

          <a href="/api/auth/logOut">Log Out</a>

          <Link href="/privatePage">
            <a>Private Page</a>
          </Link>
        </div>

        <img
          id="title"
          src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Pet_logo_with_flowers.png"
          alt="pet care logo"
        ></img>
      </div>
      <div className="grid wrapper">
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default App
