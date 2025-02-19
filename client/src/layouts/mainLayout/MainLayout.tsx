interface Props {
  children?: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
  return (
    <>
      {/* <Header></Header> */}
      {children}
      {/* <Footer></Footer> */}
    </>
  )
}

export default MainLayout
