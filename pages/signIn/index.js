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
				console.log('errorsFromServer:', errorsFromServer)

				formikRef.current.setErrors(errorsFromServer)
				formikRef.current.setSubmitting(false)
			} catch (e) {
				formikRef.current.setErrors({ error: 'Sorry, something went wrong, please try again.' })
				formikRef.current.setSubmitting(false)
			}
		}
		foo()
	})

	function onSignIn(googleUser) {
		var profile = googleUser.getBasicProfile();
		console.log('profile: ' + profile); // Do not send to your backend! Use an ID token instead.
		console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
		console.log('Name: ' + profile.getName());
		console.log('Image URL: ' + profile.getImageUrl());
		console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
	}

	return (
		<div>
			<Head>
				<script src="https://apis.google.com/js/platform.js" async defer/>
				<meta name="google-signin-client_id" content="44319531168-s6t9845kpp30cb9tqfi8gs67054luuge.apps.googleusercontent.com" />
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
					<div className="g-signin2" data-onsuccess="onSignIn" ></div>
				</div>
			</div >
		</div>
	)
}

export default SignIn