'use client'

import { type Call, StreamCall, StreamTheme, useStreamVideoClient } from '@stream-io/video-react-sdk'
import Image from 'next/image';
import React, { use, useEffect, useState } from 'react'
import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'iconsax-react';
import Link from 'next/link';
import { joinRoom } from '@/hooks/use-websocket';
import MeetingSetup from '@/components/meeting/meeting-setup';
import MeetingRoom from '@/components/meeting/meeting-room';

const Meeting = ({ params }:{ params: Promise<{ id: string }> }) => {
  const { id } = use(params)

  useEffect(() => {
    joinRoom(id)
  }, [])

  const [call, setCall] = useState<Call>()
  const [isCallLoading, setIsCallLoading] = useState(true)

  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const client = useStreamVideoClient()

  
  useEffect(() => {
    setIsCallLoading(true)
    if(!client || !id) return

    const loadCall = async () => {
      const { calls } = await client.queryCalls({ filter_conditions: { id } })
      if(calls.length > 0) setCall(calls[0])
      setIsCallLoading(false)
    }
    
    loadCall().then(res => res).catch((err: Error) => err)
  }, [ client, id ])

  if(isCallLoading) return (
    <div className='h-[calc(100vh)] w-[calc(100vw-80px)] p-5 grid place-items-center'>
      <Image src={logo} width={100} className='animate-bounce' alt={'blink-logo'} />
    </div>
  )

  return (
    <main className='h-full w-full'>
      <StreamCall call={call}>
        <StreamTheme>
          {
            !call ? (
              <div className='flex justify-center items-center h-screen flex-col gap-5'>
                <div className='relative'>
                  <h1 className='font-extrabold text-white/30 text-9xl'>404!</h1>
                  <p className='font-semibold text-3xl text-center absolute top-[50%] -translate-y-[50%] left-[50%] w-full -translate-x-[50%]'>Call Not found</p>
                </div>

                <Link href={'/meeting'}>
                  <Button className='rounded-full'><ArrowLeft color='white' /> Go Back</Button>
                </Link>
              </div>
            ) : !isSetupComplete ? (
              <MeetingSetup setSetupComplete={setIsSetupComplete} callId={id} />
            ) : (
              <MeetingRoom />
            )
          }
        </StreamTheme>
      </StreamCall>
    </main>
  )
  
}

export default Meeting





