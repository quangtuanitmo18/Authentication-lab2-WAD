import range from 'lodash/range'
import React, { useEffect, useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

const DateSelect = ({ onChange, value, errorMessage }: Props) => {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target
    // console.log(value, name)
    const newDate = {
      ...date,
      [name]: value
    }
    setDate(newDate)
    // console.log(date)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }
  useEffect(() => {
    if (value) {
      setDate({ date: value?.getDate(), month: value?.getMonth(), year: value?.getFullYear() })
    }
  }, [value])
  return (
    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
      <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Date of birth</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between'>
          <select
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3'
            onChange={handleChange}
            value={value?.getDate() || date.date}
            name='date'
          >
            <option disabled>Date</option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3'
            onChange={handleChange}
            value={value?.getMonth() || date.month}
            name='month'
          >
            <option disabled>Month</option>
            {range(0, 12).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3'
            onChange={handleChange}
            value={value?.getFullYear() || date.year}
            name='year'
          >
            <option disabled>Year</option>
            {range(1990, 2026).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='h-4  text-sm text-red-500'>{errorMessage}</div>
    </div>
  )
}

export default DateSelect
