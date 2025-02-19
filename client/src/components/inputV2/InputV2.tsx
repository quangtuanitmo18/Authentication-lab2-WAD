import { InputHTMLAttributes, useState } from 'react'
import { FieldValues, FieldPath, useController, UseControllerProps } from 'react-hook-form'

// làm cả 1 đống trên này chỉ đề cho nó gơij ý ở bên kia tôi

export type InputNumberProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  classNameInput?: string
  classNameError?: string
} & InputHTMLAttributes<HTMLInputElement> &
  UseControllerProps<TFieldValues, TName>

function InputV2<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: InputNumberProps<TFieldValues, TName>) {
  const { type, onChange, className, classNameInput = '', value, ...rest } = props
  const { field } = useController(props)
  const [localValue, setLocalValue] = useState<string>(field.value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFromInput = event.target.value
    const numberCondition = type === 'number' && (/^\d+$/.test(valueFromInput) || valueFromInput === '')
    if (numberCondition || type !== 'number') {
      // Cập nhật localValue state
      setLocalValue(valueFromInput)
      // Gọi field.onChange để cập nhật vào state React Hook Form
      field.onChange(event)
      // Thực thi onChange callback từ bên ngoài truyền vào props
      onChange && onChange(event)
    }
  }

  return (
    <div className={`inline-flex ${className}`}>
      <input
        className={`w-full rounded border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow ${classNameInput}`}
        {...rest}
        {...field}
        onChange={handleChange}
        value={value !== undefined ? value : localValue}
      />
      {/* <div className={`h-4 text-sm text-red-500 ${classNameError}`}>{fieldState.error?.message}</div> */}
    </div>
  )
}

export default InputV2

// type Gen<TFunc> = {
//   getName: TFunc
// }

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// function Hexa<TFunc extends () => string, TLastName extends ReturnType<TFunc>>(props: {
//   person: Gen<TFunc>
//   lastName: TLastName
// }) {
//   return null
// }

// const handleName: () => 'Duoc' = () => 'Duoc'

// function App() {
//   return <Hexa person={{ getName: handleName }} lastName='Duoc' />
// }
