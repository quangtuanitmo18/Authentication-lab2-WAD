import { Link, useMatch } from 'react-router-dom'
import path from 'src/constants/path'
import { Logo } from '../icon'
const HeaderRegister = () => {
  const isRegister = Boolean(useMatch('/register'))

  return (
    <header>
      <div className='container py-5'>
        <nav className='flex items-end'>
          <Link to={path.home}>
            <Logo></Logo>
          </Link>
          <p className='ml-5 text-xl lg:text-2xl'> {isRegister ? 'Đăng Ký' : 'Đăng Nhập'} </p>
        </nav>
      </div>
    </header>
  )
}

export default HeaderRegister
