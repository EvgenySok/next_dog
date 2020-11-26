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

	async function onSignIn() {
		gapi.load('auth2', function () {
			 gapi.auth2.init({
				client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
			}).then((res) => {
				if (res.error) {
					console.log('Google authorization error.', res.error)
					return
				}

				const GoogleAuth = gapi.auth2.getAuthInstance()
				
				const isSignedIn = GoogleAuth.isSignedIn.get()
				console.log('isSignedIn: ' + isSignedIn)


				const GoogleUser = GoogleAuth.currentUser.get()
				console.log('GoogleUser: ' + JSON.stringify(GoogleUser, 2, 2))

				const GoogleUserId = GoogleUser.getId()
				console.log('GoogleUserId: ' + GoogleUserId)

				var GoogleUserId_token = GoogleUser.getAuthResponse().id_token
				console.log('GoogleUserId_token: ' + GoogleUserId_token)

				const GoogleUserBasicProfile = GoogleUser.getBasicProfile()
				console.log('GoogleUserBasicProfile: ' + JSON.stringify(GoogleUserBasicProfile,2,2))

			})
		})
	}

	function signOut() {
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
			console.log('User signed out.');
		});
	}

	return (
		<>
			<Head>
				<script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
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
					<a href="#" onClick={onSignIn}>Sign in with Google</a>

					<br />
					<a href="#" onClick={signOut}>Sign out</a>
				</div>
			</div >
		</>
	)
}

export default SignIn