import type { RegisterOptions } from 'react-hook-form'
import * as yup from 'yup'
import { AnyObject } from 'yup/lib/types'

type Rules = {
  [key in 'email' | 'password' | 'confirm_passoword']?: RegisterOptions
}

const handleCheckConfirmPassword = (refString: string) => {
  return yup
    .string()
    .required('Password is required')
    .min(8, 'Character length must be between 8 and 160')
    .max(160, 'Character length must be between 5 and 160')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password format is invalid')
    .oneOf([yup.ref(refString)], 'Password confirmation does not match')
}

function testPriceMinMax(this: yup.TestContext<AnyObject>) {
  const { price_max, price_min } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .min(5, 'Character length must be between 5 and 160')
    .max(160, 'Character length must be between 5 and 160')
    .matches(
      /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i,
      'Email is invalid'
    ),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Character length must be between 8 and 160')
    .max(160, 'Character length must be between 5 and 160')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password format is invalid'),
  confirm_password: handleCheckConfirmPassword('password'),

  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Price is not valid',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Price is not valid',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required('Product name is required')
})

export const userSchema = yup.object({
  name: yup.string().max(160, 'Maximum length is 160 characters'),
  username: yup.string().max(160, 'Maximum length is 160 characters'),
  phone: yup.string().max(20, 'Maximum length is 20 characters'),
  address: yup.string().max(160, 'Maximum length is 160 characters'),
  avatar: yup.string().max(1000, 'Maximum length is 1000 characters'),
  date_of_birth: yup.date().max(new Date(), 'Please choose a date in the past'),
  current_password: schema.fields['password'],
  password: schema.fields['password'],
  new_password: schema.fields['password'],
  confirm_password: handleCheckConfirmPassword('password')
})

export const registerSchema = schema.pick(['email', 'password', 'confirm_password', 'name'])
export type RegisterSchema = yup.InferType<typeof registerSchema>
export const loginSchema = schema.pick(['email', 'password'])
export type LoginSchema = yup.InferType<typeof loginSchema>
export const priceSchema = schema.pick(['price_min', 'price_max'])
export type PriceSchema = yup.InferType<typeof priceSchema>

export const searchHeaderSchema = schema.pick(['name'])
export type SearchHeaderSchema = yup.InferType<typeof searchHeaderSchema>

// userSchema
export type UserSchema = yup.InferType<typeof userSchema>
