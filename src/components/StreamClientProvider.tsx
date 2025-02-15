'use client'

import { tokenProvider } from '@/utils/stream.actions'
import { StreamVideo, StreamVideoClient, type User } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import logo from '@/assets/logo.png'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY

const StreamClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>()
  const { user, isLoaded } = useUser()
  
  const callUser: User = {
    id: user!.id,
    name: user!.firstName ?? "Anonymous",
    // type: 'authenticated'
    image: user!.imageUrl
  }

  
  useEffect(() => {
    if(!isLoaded || !user || !apiKey) {
      return
    }

    const client = new StreamVideoClient({ apiKey, user: callUser, tokenProvider });
    setVideoClient(client)
  }, [user, callUser, isLoaded])

  if(!videoClient) return (
    <div className='h-screen grid place-items-center'>
      <Image src={logo} width={100} className='animate-bounce' alt={'blink-logo'} />
    </div>
  )

  return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  )
}

export default StreamClientProvider