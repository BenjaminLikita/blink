import React from 'react'
import SideNav from '@/components/side-nav'

const RootLayout = ({children}:{children: React.ReactNode}) => {
  return (
    // New Layout
    <div className='flex items-start text-white'>
      <SideNav />
      <div className='w-full min-h-screen'>
        {children}
      </div>
    </div>
    // Old Layout

    // // <ClerkLoading>
    // //   <ClerkLoaded>
    //     <StreamClientProvider>
    //       <div className='flex items-start text-white'>
    //         <SideNav />
    //         <div className='w-full min-h-screen'>
    //           {children}
    //         </div>
    //       </div>
    //     </StreamClientProvider>
    // //   </ClerkLoaded>
    // // </ClerkLoading>
  )
}

export default RootLayout