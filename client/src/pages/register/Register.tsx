/* eslint-disable import/no-unresolved */
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { SubmitHandler } from 'react-hook-form/dist/types'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from 'src/apis/auth.api'
import Button from 'src/components/button'
import Input from 'src/components/input'
import path from 'src/constants/path'
import { useApp } from 'src/contexts/app.context'
import { ErrorResponseApi } from 'src/types/utils.type'
import { registerSchema, RegisterSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
// interface FormData {
//   email: string
//   password: string
//   confirm_password: string
// }
type FormData = RegisterSchema

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setError,
    formState: { errors, isValid }
  } = useForm<FormData>({ resolver: yupResolver(registerSchema) })

  const { isAuthenticated, setIsAuthenticated } = useApp()
  const navigate = useNavigate()
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })
  const handleRegister: SubmitHandler<FormData> = (data: FormData) => {
    console.log(data)
    if (isValid) {
      console.log(data)
      const body = omit(data, ['confirm_password'])
      registerAccountMutation.mutate(body, {
        onSuccess(data, variables, context) {
          navigate(path.login)
          toast.success('Register successfully')
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<ErrorResponseApi<Omit<FormData, 'confirm_password'>>>(error)) {
            const formError = error.response?.data.errors
            // console.log(Object.keys(formError))
            if (formError) {
              for (const key in formError) {
                setError(key as keyof Omit<FormData, 'confirm_password'>, {
                  message: (formError[key as keyof Omit<FormData, 'confirm_password'>] as any).msg,
                  type: 'Server'
                })
              }
            }
          }
        }
      })
    }
    console.log(errors)
  }

  return (
    <div className='h-screen bg-primary'>
      <Helmet>
        <title> Register | Authentication</title>
        <meta name='description' content='Đăng nhập vào dự án Shopee Clone' />
      </Helmet>
      <div className='container flex h-full items-center justify-center py-20'>
        <div className='w-[500px] rounded bg-white p-5'>
          <p className=' text-xl text-black lg:text-2xl'>Register</p>
          <form action='' onSubmit={handleSubmit(handleRegister)}>
            <Input
              type='text'
              placeholder='Name'
              register={register}
              errorMessage={errors?.name ? errors?.name.message : ''}
              wrapperClassName='mt-6'
              name='name'
            ></Input>

            <Input
              type='email'
              placeholder='Email'
              register={register}
              errorMessage={errors?.email ? errors?.email.message : ''}
              name='email'
            ></Input>

            <Input
              type='password'
              placeholder='Password'
              register={register}
              errorMessage={errors?.password ? errors?.password.message : ''}
              wrapperClassName='mt-2'
              name='password'
            ></Input>
            <Input
              type='password'
              placeholder='Confirm Password'
              register={register}
              errorMessage={errors?.confirm_password ? errors?.confirm_password.message : ''}
              wrapperClassName='mt-2'
              name='confirm_password'
            ></Input>

            <Button
              type='submit'
              isLoading={registerAccountMutation.isLoading}
              disabled={registerAccountMutation.isLoading}
            >
              Register
            </Button>
            <div className='mt-4 text-center text-sm text-gray-500'>
              Already have an account?{' '}
              <Link className='text-primary' to={path.login}>
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
