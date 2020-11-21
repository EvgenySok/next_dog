import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Link from 'next/link'
import { postData } from '../../secondary-functions/requests'

const SignIn = () => {

	return (
		<>
			<h1>Sign In!</h1>
			<div>
				<Formik
					initialValues={{ email: '', password: '' }}
					validate={values => {
						const errors = {};
						if (!values.email) {
							errors.email = 'Required';
						} else if (
							!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
						) {
							errors.email = 'Invalid email address';
						}
						return errors;
					}}
					onSubmit={(values, { setSubmitting }) => {
						setTimeout(() => {
							postData(values, '/api/auth/signIn')
							setSubmitting(false);
						}, 400);
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<Field type="email" name="email" />
							<ErrorMessage name="email" component="div" />
							<Field type="password" name="password" autoComplete="new-password" />
							<ErrorMessage name="password" component="div" />
							<button type="submit" disabled={isSubmitting}>							Submit      </button>
						</Form>
					)}
				</Formik >

				<div className="">
					<span className="">
						Don’t have an account?
						</span>

					<Link href="/signUp">
						<a>Sign Up</a>
					</Link>

				</div>
			</div>

		</>





	)
}

export default SignIn