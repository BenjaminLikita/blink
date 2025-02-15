import React from 'react'
import StreamClientProvider from '@/components/StreamClientProvider'
import SideNav from '@/components/side-nav'

const RootLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <StreamClientProvider>
      <div className='flex items-start text-white'>
        <SideNav />
        <div className='w-full'>
          {children}
        </div>
      </div>
    </StreamClientProvider>
  )
}

export default RootLayout