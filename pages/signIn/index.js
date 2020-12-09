import React, { useRef, useCallback, useEffect } from 'react'
import Head from "next/head"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Link from 'next/link'
import { postData } from '../../secondary-functions/requests'
import { SigninValidateSchema } from '../../validate/authValidate'

const SignIn = () => {
	const formikRef = useRef();

	useEffect(() => {
		window.fbAsyncInit = (function () {
			FB.init({
				appId: `${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`,
				cookie: true,                     // Enable cookies to allow the server to access the session.
				xfbml: true,                     // Parse social plugins on this webpage.
				version: `${process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION}`           // Use this Graph API version for this call.
			})
		})()
	}, [])

	const onSubmit = useCallback((values) => {
		async function foo() {
			try {
				const errorsFromServer = await postData(values, '/api/auth/signIn')
				if (errorsFromServer) {
					formikRef.current.setErrors(errorsFromServer)
					console.log('errorsFromServer:', formikRef.current)

				}
				formikRef.current.setSubmitting(false)
			} catch (e) {
				formikRef.current.setErrors({ error: 'Sorry, something went wrong, please try again.' })
				formikRef.current.setSubmitting(false)
			}
		}
		foo()
	})
	// google //
	async function signInWithGoogle() {
		gapi.load('auth2', function () {
			gapi.auth2.init({
				client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
			}).then((res) => {
				if (res.error) {
					console.log('Google authorization error.', res.error)
					return
				}
				const GoogleAuth = gapi.auth2.getAuthInstance()

				if (GoogleAuth.isSignedIn.get()) {
					const GoogleUser = GoogleAuth.currentUser.get()
					const GoogleUserId_token = GoogleUser.getAuthResponse(true).id_token
					postData({ provider: 'google', GoogleUserId_token }, '/api/auth/OAuth')
				}
			})
		})
	}

	function signOut() {
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
			console.log('User signed out.');
		});
	}


	// facebook // 
	function signInWithFacebook() {
		FB.login(async function (response) {
			console.log('response facebook:', response);
			if (response.status === 'connected') {
				const { authResponse } = response
				postData({ provider: 'facebook', authResponse }, '/api/auth/OAuth')
			} 
		}, { scope: 'public_profile,email' })
	}



	return (
		<>
			<Head>
				<script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
				<meta name="google-signin-client_id" content={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}></meta>

				<script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/all.js"></script>

			</Head>

			<div className="form">
				<div className="header">Sign In!</div>
				<Formik
					innerRef={formikRef}
					initialValues={{ email: '', password: '' }}
					validationSchema={SigninValidateSchema}
					onSubmit={onSubmit}

					handleChange={(values) => { }}
				>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting, }) => (
							<form onSubmit={handleSubmit}>
								<div className="field-wrap">
									<label className={values.email ? "active" : ""} >Email Address<span>*</span></label>
									<Field type="email" name="email" onChange={handleChange} />
									<ErrorMessage name="email" component="div" />
								</div>
								<div className="field-wrap">
									<label className={values.password ? "active" : ""}>Password<span>*</span></label>
									<Field type="password" name="password" />
									<ErrorMessage name="password" component="div" />
									<div>
										{errors.success ? (<div>{errors.success} </div>) : null}
										{errors.error ? (<div>{errors.error} </div>) : null}
									</div>
								</div>

								<button type="submit" className="button" disabled={isSubmitting}>
									Submit
                </button>
							</form>
						)}
				</Formik >
				<br />
				<Link href="/signUp">
					<a className="">Don’t have an account?</a>
				</Link>
				<br />
				<Link href="/">
					<a className="">Forgot Password?</a>
				</Link>
				<br />
				<a href="#" onClick={signInWithGoogle}>Sign in with Google</a>
				<br />
				<a href="#" onClick={signOut}>Sign out</a>

				<br />
				<a href="#" onClick={signInWithFacebook}>Sign in with Facebook</a>
				<br />
				<a href="#" onClick={signOut}>Sign out</a>
				<div id="status"></div>

			</div>
		</>
	)
}

export default SignIn
