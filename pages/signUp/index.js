import React, { useRef, useCallback } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { postData } from '../../secondary-functions/requests'
import { SignupValidateSchema } from '../../validate/authValidate'

const SignUp = () => {
  const formikRef = useRef();

  const onSubmit = useCallback((values) => {
    async function foo() {
      try {
        const errorsFromServer = await postData(values, '/api/auth/signUp')
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

  return (
    <div>
      <h1>User registration</h1>
      <Formik
        innerRef={formikRef}
        initialValues={{ email: '', password: '' }}
        validationSchema={SignupValidateSchema}
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
        }) => (
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
          )
        }
      </Formik>
    </div>)
}
export default SignUp