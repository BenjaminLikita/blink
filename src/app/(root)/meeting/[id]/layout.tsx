import React from 'react'
import StreamClientProvider from '@/components/StreamClientProvider'

const MeetingLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <StreamClientProvider>
      {children}
    </StreamClientProvider>
  )
}

export default MeetingLayout