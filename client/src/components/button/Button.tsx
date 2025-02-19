import { ButtonHTMLAttributes } from 'react'
import { LoadingSpin } from '../loading'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

export default function Button(props: ButtonProps) {
  const { isLoading, disabled, className, children, ...rest } = props

  return (
    <button
      className={`mt-6 flex h-[48px] w-full items-center justify-center rounded bg-primary p-3 text-white ${
        isLoading ? 'cursor-not-allowed' : ''
      } ${className}`}
      disabled={disabled}
      {...rest}
    >
      {isLoading ? <LoadingSpin></LoadingSpin> : children}
    </button>
  )
}
