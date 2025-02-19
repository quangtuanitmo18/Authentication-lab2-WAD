import { lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from './constants/path'
import { useApp } from './contexts/app.context'
import MainLayout from './layouts/mainLayout'
import RegisterLayout from './layouts/registerLayout'
import UserLayout from './pages/user/layouts'

const Login = lazy(() => import('./pages/login'))
const Register = lazy(() => import('./pages/register'))
const NotFound = lazy(() => import('./pages/notFound'))
const Profile = lazy(() => import('./pages/user/pages/profile'))
const ChangePassword = lazy(() => import('./pages/user/pages/changePassword'))

function ProtectedRoute() {
  const { isAuthenticated } = useApp()

  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}
function RejectedRoute() {
  const { isAuthenticated } = useApp()
  // const isAuthenticated = false
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.profile} />
}

const useRouteElement = () => {
  const routeElements = useRoutes([
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout></UserLayout>
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: (
                <Suspense fallback={<div>...Loading</div>}>
                  <Profile />
                </Suspense>
              )
            },

            {
              path: path.changePassword,
              element: (
                <Suspense fallback={<div>...Loading</div>}>
                  <ChangePassword />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense fallback={<div>...Loading</div>}>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Suspense fallback={<div>...Loading</div>}>
                <Register></Register>
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },

    {
      path: '*',
      element: (
        <MainLayout>
          <Suspense fallback={<div>...Loading</div>}>
            <NotFound />
          </Suspense>
        </MainLayout>
      )
    }
  ])

  return routeElements
}

export default useRouteElement
