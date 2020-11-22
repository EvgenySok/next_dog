import * as Yup from 'yup';

export const SignupValidateSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Please enter at least 6 chars')
    .max(20, 'Please enter no more 20 chars')
    .required('Please enter at least 6 chars'),
  email: Yup.string().email('Please enter a valid email').required('Required'),
})

export const SigninValidateSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Please enter at least 6 chars')
    .max(20, 'Please enter no more 20 chars')
    .required('Please enter at least 6 chars'),
  email: Yup.string().email('Please enter a valid email').required('Required'),
})
