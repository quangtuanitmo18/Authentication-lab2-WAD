import classNames from 'classnames'
import React, { useState } from 'react'
import InputNumber, { InputNumberProps } from '../inputNumber'

interface Props extends InputNumberProps {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onFocusOut?: (value: number) => void
  onType?: (value: number) => void
}

const QuantityController = (props: Props) => {
  const { max, onDecrease, onIncrease, onType, value, onFocusOut, ...rest } = props
  const [localState, setLocalState] = useState<number>(Number(value || 1))

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }

    onType && onType(_value)
    setLocalState(_value)
  }

  const increase = () => {
    let _value = Number(value || localState) + 1
    if (max !== undefined && _value > max) {
      _value = max
    }
    // console.log(_value)
    onIncrease && onIncrease(_value)
    setLocalState(_value)
  }

  const decrease = () => {
    let _value = Number(value || localState) - 1
    if (_value < 1) {
      _value = 1
    }
    onDecrease && onDecrease(_value)
    setLocalState(_value)
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(e.target.value))
  }
  return (
    <div className={`flex items-center`}>
      <button
        className={classNames(
          'flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600',
          {
            'cursor-not-allowed': value === 1
          }
        )}
        onClick={decrease}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
        </svg>
      </button>
      <InputNumber value={value || localState} onChange={handleChange} onBlur={handleBlur} {...rest}></InputNumber>
      <button
        className={classNames(
          'flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600',
          {
            'cursor-not-allowed': value === max
          }
        )}
        onClick={increase}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}

export default QuantityController
