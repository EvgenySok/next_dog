import React, { useRef, useCallback } from 'react'
import Head from "next/head"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Link from 'next/link'
import { postData } from '../../secondary-functions/requests'
import { SigninValidateSchema } from '../../validate/authValidate'

const SignIn = () => {
	const formikRef = useRef();

	const onSubmit = useCallback((values) => {
		async function foo() {
			try {
				const errorsFromServer = await postData(values, '/api/auth/signIn')
				if (errorsFromServer) {
					formikRef.current.setErrors(errorsFromServer)
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
	async function signInWithFacebook() {
		await FB.login(function (response) {
			console.log('response facebook:', response);

			if (response.status === 'connected') {
				// Logged into your webpage and Facebook.
			} else {
				// The person is not logged into your webpage or we are unable to tell. 
			}
		})
	}
	// https://next-dog.vercel.app/api/auth/OAuth
	return (
		<>
			<Head>
				<script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
				<meta name="google-signin-client_id" content={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}></meta>

				<script>
					window.fbAsyncInit = function() {
						FB.init({
							appId: `${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`,
							autoLogAppEvents: true,
							xfbml: true,
							version: `${process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION}`,
						})
					}
				</script>
				<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script>

			</Head>

			<div>
				<h1>Sign In!</h1>
				<div>
					<Formik
						innerRef={formikRef}
						initialValues={{ email: '', password: '' }}
						validationSchema={SigninValidateSchema}
						onSubmit={onSubmit}
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
									<h3>email</h3>
									<Field type="email" name="email" />
									<ErrorMessage name="email" component="div" />
									<h3>password</h3>
									<Field type="password" name="password" autoComplete="new-password" />
									<ErrorMessage name="password" component="div" />
									{errors.success ? (<div>{errors.success} </div>) : null}
									{errors.error ? (<div>{errors.error} </div>) : null}
									<button type="submit" disabled={isSubmitting}>
										Submit
              </button>
								</form>
							)}
					</Formik >
					<br />
					<div className="">
						<span className="">
							Don’t have an account?
						</span>

						<Link href="/signUp">
							<a>Sign Up</a>
						</Link>

					</div>
					<br />
					<a href="#" onClick={signInWithGoogle}>Sign in with Google</a>
					<br />
					<a href="#" onClick={signOut}>Sign out</a>

					<br />
					<a href="#" onClick={signInWithFacebook}>Sign in with Facebook</a>
					<br />
					<a href="#" onClick={signOut}>Sign out</a>

				</div>
			</div >
		</>
	)
}

export default SignIn
