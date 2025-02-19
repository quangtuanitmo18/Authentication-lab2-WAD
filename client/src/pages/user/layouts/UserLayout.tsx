import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'
import { User } from 'src/types/user.type'
import socket from 'src/utils/socket'
import UserSideNav from '../components/userSidenav'

const UserLayout = () => {
  useEffect(() => {
    socket.on('userRegistered', (data: { user: User }) => {
      console.log(data)
      toast.info(`New user registered: ${data?.user?.email}`)
    })

    // Cleanup the event listener when the component unmounts
    return () => {
      socket.off('userRegistered')
    }
  }, [])

  return (
    <div className='bg-neutral-100 py-16 text-sm text-gray-600'>
      <div className='container'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
          <div className='md:col-span-3 lg:col-span-2'>
            <UserSideNav />
          </div>
          <div className='md:col-span-9 lg:col-span-10'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLayout
