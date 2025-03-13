import { Stack } from '@chakra-ui/react'
import React from 'react'
import NavigationBar from '../components/navigation-bar'

function MainLayout({children}) {
  return (
    <Stack h={'100vh'} w={'100vw'}>
      <NavigationBar />
      {children}
    </Stack>
  )
}

export default MainLayout
