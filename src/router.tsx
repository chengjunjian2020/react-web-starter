import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import ErrorPage from './components/error-page'
import { getDefaultLayout } from './components/layout'
import WorkSpaces from './pages/workspaces'
import Login from './pages/login'
import Editor from './pages/editor'
import { ToolMenuType } from './pages/editor/constants'
import VideoPage from './pages/editor/features/resource'
import Subtitles from './pages/editor/features/subtitles'
import ContentCreation from './pages/editor/features/contentCreation'

export const routerObjects: RouteObject[] = [
  // {
  //   path: '/',
  //   Component: HomePage,
  // },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/workspaces',
    Component: WorkSpaces
  },
  {
    path: '/editor/:id',
    Component: Editor,
    children:[
      { index: true, element: <Navigate to={ToolMenuType.Resource} replace /> },
      {
        path: "resource",
        Component: VideoPage,
      },
      {
        path: "subtitles",
        Component: Subtitles,
      },
      {
        path: "content-creation",
        Component: ContentCreation,
      },
      { path: "*", element: <Navigate to={ToolMenuType.Resource} replace /> }
    ]
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
