import React from 'react'
import FullScreenLoader from './ui/full-screen-loader'

function SplashScreen() {
  return (
    <FullScreenLoader
      variant="dots"
      size="xl"
      text="Welcome to Plivo"
      background="gradient"
    />
  )
}

export default SplashScreen