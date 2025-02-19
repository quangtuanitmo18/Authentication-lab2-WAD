import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { userApi } from 'src/apis/user.api'
import Input from 'src/components/input'
import { userSchema, UserSchema } from 'src/utils/rules'

import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import { mediaApi } from 'src/apis/media.api'
import Button from 'src/components/button'
import InputFile from 'src/components/inputFile'
import { useApp } from 'src/contexts/app.context'
import { ErrorResponseApi } from 'src/types/utils.type'
import { setProfileToLS } from 'src/utils/app'
import { getAvatarUrl, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import DateSelect from '../../components/DateSelect'

type FormData = Pick<UserSchema, 'name' | 'date_of_birth' | 'avatar'>
const profileSchema = userSchema.pick(['name', 'date_of_birth', 'avatar'])
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}

export default function Profile() {
  const { setIsAuthenticated } = useApp()

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })

  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const { setProfile } = useApp()
  const updateProfileMutation = useMutation(userApi.updateProfile)
  const uploadAvatarMutaion = useMutation(mediaApi.uploadImage)

  const {
    control,
    register,
    watch,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isValid }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const avatar = watch('avatar')
  // console.log(avatar)

  const onSubmit = handleSubmit(async (data) => {
    // console.log(data)
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutaion.mutateAsync(form)
        avatarName = (uploadRes.data.result as any)[0]?.name
        setValue('avatar', avatarName)
      }
      console.log(avatarName)

      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        ...(avatarName && { avatar: avatarName })
      })
      setProfileToLS(res.data.result)
      setProfile(res.data.result)
      refetch()
      toast.success('Update profile successfully')
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponseApi<FormDataError>>(error)) {
        const formError = error.response?.data.errors
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: (formError[key as keyof FormDataError] as any)?.msg,
              type: 'Server'
            })
          })
          // console.log(formError)
        }
      }
    }
    // const res = await updateProfileMutation.mutateAsync({ ...data, date_of_birth: data.date_of_birth?.toISOString() })
  })

  // const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const fileFromLocal = e.target.files?.[0]
  //   // console.log(fileFromLocal)
  //   if (fileFromLocal && (fileFromLocal.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
  //     toast.error('Dụng lượng file tối đa 1 MB Định dạng:.JPEG, .PNG')
  //   } else {
  //     setFile(fileFromLocal)
  //   }
  // }
  const handleFileChange = (file?: File) => {
    setFile(file)
  }

  const profile = profileData?.data.result
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)

      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  if (!profile) return null

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <Helmet>
        <title>Authentication</title>
        <meta name='description' content='Thông tin tài khoản cá nhân dự án Shopee Clone' />
      </Helmet>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>My profile</h1>
      </div>
      <div className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
        <form className='mt-6 w-full flex-col md:mt-0 md:pr-12' onSubmit={onSubmit}>
          <div className='flex w-full justify-between'>
            <div className='w-[70%]'>
              <div className='flex flex-col flex-wrap sm:flex-row'>
                <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
                <div className='sm:w-[80%] sm:pl-5'>
                  <div className='pt-3 text-gray-700'>{profile.email}</div>
                </div>
              </div>
              <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
                <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Name</div>
                <div className='sm:w-[80%] sm:pl-5'>
                  <Input name='name' register={register} placeholder='Tên' errorMessage={errors.name?.message} />
                </div>
              </div>

              <Controller
                control={control}
                name='date_of_birth'
                render={({ field }) => (
                  <DateSelect
                    errorMessage={errors.date_of_birth?.message}
                    value={field.value}
                    onChange={field.onChange}
                  ></DateSelect>
                )}
              />
            </div>
            <div className='flex w-[30%] justify-center md:w-72 md:border-l md:border-l-gray-200  '>
              <div className='flex flex-col items-center'>
                <div className='my-5 h-24 w-24'>
                  <img
                    crossOrigin='anonymous'
                    src={previewImage || getAvatarUrl(avatar)}
                    alt='avatar'
                    className='w-full  rounded-full object-cover'
                  />
                </div>
                <InputFile onChange={handleFileChange}></InputFile>
                <div className='mt-3 text-gray-400'>
                  <div>Max file size: 1 MB</div>
                  <div>Allowed formats:.JPEG, .PNG</div>
                </div>
                <div>{errors.avatar?.message}</div>
              </div>
            </div>
          </div>

          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
            <Button className='w-[400px]'>Save</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
