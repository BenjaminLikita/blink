'use client'

import { type Call, PaginatedGridLayout, SpeakerLayout, StreamCall, StreamTheme, useCall, useCallStateHooks, useStreamVideoClient, VideoPreview } from '@stream-io/video-react-sdk'
import Image from 'next/image';
import React, { use, useEffect, useState } from 'react'
import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/button';
import { ArrowLeft, Grid1, Grid5, Setting2 } from 'iconsax-react';
import Link from 'next/link';
import AudioVideoControls from '@/components/audio_video_controls';
import ShareScreenLogoutControls from '@/components/shareScreen_logout_controls';
import MenuParticipantsCount from '@/components/menu_participants_controls';

const Meeting = ({ params }:{ params: Promise<{ id: string }> }) => {
  const { id } = use(params)

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
    
    loadCall()
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
              <MeetingSetup setSetupComplete={setIsSetupComplete} />
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


const MeetingSetup = ({setSetupComplete}:{setSetupComplete: (value: boolean) => void}) => {

  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false)
  const call = useCall()
  
  

  if(!call) throw new Error('Use Call must be used within StreamCallComponent')
  
  // useEffect(() => {
  //   if(isMicCamToggledOn){
  //     call?.camera.disable()
  //     call?.microphone.disable()
  //   } else{
  //     call?.camera.enable()
  //     call?.microphone.enable()
  //   }

  // }, [isMicCamToggledOn, call?.camera, call?.microphone])

  

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-14 text-white'>
      <div className='flex flex-col items-center gap-5'>
        <Image src={logo} width={80} alt='blink-logo' />
        <div className='space-y-3'>
          <h1 className='text-4xl font-light text-white/80 text-center'>Get Started</h1>
          <p className='text-gray-500'>Prepare your audio and video setup before connecting</p>
        </div>
      </div>

      <div>
        <VideoPreview className='!w-[600px] border-none' />
        {/* <CallControls /> */}
        <div className='flex justify-between items-center my-5'>

          {/* Left Options */}
          <AudioVideoControls />
          

          {/* Right Options */}
          <div className='border border-white/30 flex rounded-lg'>
            <span className='p-2'>
              <Setting2 color='white' size={20} />
            </span>
          </div>
        </div>
        
        <div className='flex items-center'>
          <Button size={'lg'} onClick={async () => {await call.join(); setSetupComplete(true)}} className='m-auto'>Join Meeting</Button>
        </div>
      </div>
    </div>
  )
}

export type ICallLayout = 'grid' | 'speaker-left' | 'speaker-right'

const MeetingRoom = () => {
  const [layout, setLayout] = useState<ICallLayout>('speaker-left')

  const call = useCall()

  const { useCallCallingState, useCallMembers, useLocalParticipant, useRemoteParticipants } = useCallStateHooks()
  // call?.screenShare.enable()

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />
              
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition={'left'} />
          
      default:
        return <SpeakerLayout participantsBarPosition={'right'} />
    }
  }

  const { useHasOngoingScreenShare, useCallCustomData } = useCallStateHooks();
  const hasOngoingScreenshare = useHasOngoingScreenShare();
  // const callData = useCallCustomData()

  useEffect(() => {
    // set screen share compatible layout
    if (hasOngoingScreenshare) return setLayout("speaker-left");

    return setLayout("grid");
  }, [hasOngoingScreenshare]);
  return (
    <div className='relative h-screen w-full overflow-hidde pt-4 text-white p-5 flex flex-col items-center justify-between'>
      <div className='flex items-center gap-5'>
        <button onClick={() => setLayout('grid')}><Grid1 color={layout === 'grid' ? '#18e6de' : 'white'} variant={layout === 'grid' ? 'TwoTone' : 'Linear'} size={30} /></button>
        <button onClick={() => setLayout('speaker-left')}><Grid5 color={layout === 'speaker-left' ? '#18e6de' : 'white'} variant={layout === 'speaker-left' ? 'TwoTone' : 'Linear'} size={30} /></button>
        <button onClick={() => setLayout('speaker-right')}><Grid5 className='rotate-180' color={layout === 'speaker-right' ? '#18e6de' : 'white'} variant={layout === 'speaker-right' ? 'TwoTone' : 'Linear'} size={30} /></button>
      </div>
      {/* <div>
      </div> */}

      <div className='w-full flex items-center max-w-screen-s md:max-w-[calc(100vw-30%)]'>
        {/* <p>{callData.description}</p> */}
        <CallLayout />
      </div>
      {/* <div className='relative flex size-full items-center justify-center gap-3'>
        <div className="flex h-[calc(100%-100px)] w-full flex-col max-w-[1000px] items-center gap-5">
          <CallLayout />
          <div className='flex items-center w-full justify-between'>
            <AudioVideoControls />
            <ShareScreenLogoutControls />
            <MenuParticipantsCount />
          </div>
        </div>
      </div> */}

      <div className='flex items-center w-full justify-between flex-wrap'>
        <AudioVideoControls />
        <ShareScreenLogoutControls />
        <MenuParticipantsCount />
      </div>
    </div>
  )
}