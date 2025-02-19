import React from 'react'

interface Props {
  children?: React.ReactNode
}

const RegisterLayout = ({ children }: Props) => {
  return (
    <>
      {/* <HeaderRegister></HeaderRegister> */}
      {children}
      {/* <Footer></Footer> */}
    </>
  )
}

export default RegisterLayout
