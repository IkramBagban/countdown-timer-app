import { createBrowserRouter, RouterProvider } from 'react-router'
import { Render } from './views/Render'
import { Settings } from './views/Settings'
import { useEffect } from 'react'
import { send } from '@telemetryos/sdk'

const router = createBrowserRouter([
  {
    path: '/render',
    Component: Render,
  },
  {
    path: '/settings',
    Component: Settings,
  },
])

export function App() {
  useEffect(() => {
    send('ready', {})
  }, [])

  return (
    <RouterProvider router={router} />
  )
}
