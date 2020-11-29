import React, { useRef, useCallback, useEffect } from 'react'
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

	useEffect(() => {
		function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
			console.log('statusChangeCallback');
			console.log(response);                   // The current login status of the person.
			if (response.status === 'connected') {   // Logged into your webpage and Facebook.
				testAPI();
			} else {                                 // Not logged into your webpage or we are unable to tell.
				document.getElementById('status').innerHTML = 'Please log ' +
					'into this webpage.';
			}
		}


		function checkLoginState() {               // Called when a person is finished with the Login Button.
			FB.getLoginStatus(function (response) {   // See the onlogin handler
				statusChangeCallback(response);
			});
		}


		window.fbAsyncInit = function () {
			FB.init({
				appId: `${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`,
				cookie: true,                     // Enable cookies to allow the server to access the session.
				xfbml: true,                     // Parse social plugins on this webpage.
				version: `${process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION}`           // Use this Graph API version for this call.
			});


			FB.getLoginStatus(function (response) {   // Called after the JS SDK has been initialized.
				statusChangeCallback(response);        // Returns the login status.
			});
		};

		function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
			console.log('Welcome!  Fetching your information.... ');
			FB.api('/me', function (response) {
				console.log('Successful login for: ' + response.name);
				document.getElementById('status').innerHTML =
					'Thanks for logging in, ' + response.name + '!';
			});
		}
	}, [])

	return (
		<>
			<Head>
				<script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
				<meta name="google-signin-client_id" content={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}></meta>

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
