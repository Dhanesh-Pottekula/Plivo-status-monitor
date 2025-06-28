import React from 'react'
import { cn } from '@/lib/utils'
import Loader from './loader'

interface FullScreenLoaderProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
  background?: 'blur' | 'solid' | 'gradient'
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  variant = 'spinner',
  size = 'lg',
  text = 'Loading...',
  className,
  background = 'blur'
}) => {
  const backgroundClasses = {
    blur: 'backdrop-blur-sm bg-background/80',
    solid: 'bg-background',
    gradient: 'bg-gradient-to-br from-background via-background/95 to-background/90'
  }

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center',
      backgroundClasses[background],
      className
    )}>
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <Loader 
          variant={variant} 
          size={size} 
          text={text}
        />
      </div>
    </div>
  )
}

export default FullScreenLoader 