import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from 'src/apis/auth.api'
import Button from 'src/components/button'
import Input from 'src/components/input'
import path from 'src/constants/path'
import { useApp } from 'src/contexts/app.context'
import { ErrorResponseApi } from 'src/types/utils.type'
import { loginSchema, LoginSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = LoginSchema

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    // getValues,
    // watch,
    formState: { errors, isValid }
  } = useForm<FormData>({ resolver: yupResolver(loginSchema) })

  const { isAuthenticated, setIsAuthenticated, setProfile } = useApp()
  const navigate = useNavigate()
  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.login(body)
  })
  const handleLogin = (data: FormData) => {
    // console.log(data)
    if (isValid) {
      loginMutation.mutate(data, {
        onSuccess(data, variables, context) {
          setIsAuthenticated(true)
          setProfile(data.data.result.user)
          navigate(path.profile)
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<ErrorResponseApi<FormData>>(error)) {
            const formError = error.response?.data?.errors
            if (formError) {
              for (const key in formError) {
                setError(key as keyof FormData, {
                  message: (formError[key as keyof FormData] as any)?.msg,
                  type: 'Server'
                })
              }
            }
          }
        }
      })
      // console.log(body)
    }
  }

  return (
    <div className='h-svh bg-primary'>
      <Helmet>
        <title> login | Authentication</title>
        <meta name='description' content='Đăng nhập vào dự án Shopee Clone' />
      </Helmet>
      <div className='container flex h-full items-center justify-center py-20'>
        <div className='w-[500px] rounded bg-white p-5'>
          <p className=' text-xl text-black lg:text-2xl'>Login</p>
          <form action='' onSubmit={handleSubmit(handleLogin)}>
            <Input
              type='email'
              placeholder='Email'
              register={register}
              errorMessage={errors?.email ? errors?.email.message : ''}
              wrapperClassName='mt-6'
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

            <Button type='submit' isLoading={loginMutation.isLoading} disabled={loginMutation.isLoading}>
              Login
            </Button>
            <div className='mt-4 text-center text-sm text-gray-500'>
              <Link className='text-primary' to={path.register}>
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
