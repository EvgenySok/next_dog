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
    <div className="form">
      <div className="header">User registration</div>
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
    </div>
  )
}
export default SignUp