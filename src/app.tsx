import React, { useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import { createRouter } from './router'
import { Toaster } from 'src/components/ui/sonner'

export default function App() {
  return (
    <div>
      <RouterProvider router={createRouter()} />
      <Toaster position='top-center' />
    </div>
  )
}
