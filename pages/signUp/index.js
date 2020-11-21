import React, { useRef, useCallback } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { postData } from '../../secondary-functions/requests'
import { SignupSchema } from '../../validate/authValidate'

const SignUp = () => {
  const formikRef = useRef();

  const onSubmit = useCallback((values) => {
    async function foo() {
      try {
        const errorsFromServer = await postData(values, '/api/auth/signUp')
        const errorsFoClient = errorsFromServer.reduce((acc, e) => ({ ...acc, [e.param]: e.msg }), {})
        formikRef.current.setErrors(errorsFoClient)
        formikRef.current.setSubmitting(false)

      } catch (e) {
        formikRef.current.setErrors({ error: 'Sorry, something went wrong, please try again.' })
        formikRef.current.setSubmitting(false)

      }
    }
    foo()
  }
  )

  return (
    <>
      <h1>User registration</h1>
      <Formik
        innerRef={formikRef}
        initialValues={{ email: '', password: '' }}
        validationSchema={SignupSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => {
          console.log('values:', values, 'errors', errors)
          return (
            <form onSubmit={handleSubmit}>
              <p>email</p>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" />
              <p>password</p>
              <Field type="password" name="password" autoComplete="new-password" />
              <ErrorMessage name="password" component="div" />
              {errors.success ? (<div>{errors.success} </div>) : null}
              {errors.error ? (<div>{errors.error} </div>) : null}
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </form>
          )
        }}
      </Formik>
    </>)
}
export default SignUp