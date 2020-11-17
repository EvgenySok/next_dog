import React from 'react';
import { Formik } from 'formik';

const SignUp = () => {
  const contentType = 'application/json'

  const postData = async (form) => {
    try {
      const res = await fetch('/api/auth/signUp', {
        method: 'POST',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      })

      console.log('res.body:', res.body)
      
      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status)
      }

      router.push('/')
    } catch (error) {
      console.log('error:', error.message)

      // setMessage('Failed to add pet')
    }
  }
  return (
    <>
      <h1>User registration</h1>
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
            postData(values)
            setSubmitting(false);
          }, 1000);
        }}
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
              <p>email</p>
              <input
                type="email"
                name="email"
                placeholder="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.email && touched.email && errors.email}
              <p>password</p>
              <input
                type="password"
                name="password"
                placeholder="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {errors.password && touched.password && errors.password}
              <button type="submit" disabled={isSubmitting}>
                Submit
          </button>
            </form>
          )}
      </Formik>
    </>)
}
export default SignUp