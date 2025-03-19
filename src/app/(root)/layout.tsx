import React from 'react'
import StreamClientProvider from '@/components/StreamClientProvider'
import SideNav from '@/components/side-nav'

const RootLayout = ({children}:{children: React.ReactNode}) => {
  return (
    // <ClerkLoading>
    //   <ClerkLoaded>
        <StreamClientProvider>
          <div className='flex items-start text-white'>
            <SideNav />
            <div className='w-full min-h-screen'>
              {children}
            </div>
          </div>
        </StreamClientProvider>
    //   </ClerkLoaded>
    // </ClerkLoading>
  )
}

export default RootLayout