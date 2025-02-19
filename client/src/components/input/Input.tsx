import { InputHTMLAttributes } from 'react'
import { UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<any>
  wrapperClassName?: string
  clasName?: string
  errorMessage?: string
  name: string
}

const Input = (props: Props) => {
  const { type, register, wrapperClassName, clasName, placeholder, errorMessage, name, ...rest } = props
  return (
    <div className={`${wrapperClassName}`}>
      <input
        className={`w-full rounded border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow ${clasName}`}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        {...rest}
      />
      <div className='h-4 text-sm text-red-500'>{errorMessage}</div>
    </div>
  )
}

export default Input
