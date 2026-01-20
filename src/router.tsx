import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import ErrorPage from './components/error-page'
import { getDefaultLayout } from './components/layout'
import Home from './pages/home'
import DoctorDetail from './pages/doctor-detail'

export const routerObjects: RouteObject[] = [
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/doctor/:id',
    Component: DoctorDetail,
  },
]

export function createRouter(): ReturnType<typeof createBrowserRouter> {
  const routeWrappers = routerObjects.map((router) => {
    // @ts-ignore TODO: better type support
    const getLayout = router.Component?.getLayout || getDefaultLayout
    const Component = router.Component!
    const page = getLayout(<Component />)
    return {
      ...router,
      element: page,
      Component: null,
      ErrorBoundary: ErrorPage,
    }
  })
  return createBrowserRouter(routeWrappers)
}
