"use client"



import { requestPrivateCallAccess, socket } from "@/hooks/use-websocket"
import { useAuth, useUser } from "@clerk/nextjs"
import { useCall, VideoPreview } from "@stream-io/video-react-sdk"
import Image from "next/image"
import { useEffect, useState } from "react"
import AudioVideoControls from "./audio_video_controls"
import { Setting2 } from "iconsax-react"
import { Button } from "../ui/button"
import logo from '@/assets/logo.png'
import DisabledVideoPreview from "./disabled-video-preview"
import NoVideoPreview from "./no-video-preview"
import { ClipLoader } from "react-spinners"

const MeetingSetup = ({setSetupComplete, callId}:{setSetupComplete: (value: boolean) => void, callId: string}) => {

  const call = useCall()

  if(!call) throw new Error('Use Call must be used within StreamCallComponent')
  const [pendingAccess, setPendingAccess] = useState(false)


  const { user } = useUser()
  useEffect(() => {
    const enableDevices = async () => {
      await call.microphone.enable()
      await call.camera.enable()
    }
    enableDevices()

    socket.on("acceptedPrivateCallAccess", async (_data) => {
      await call.join({ 
        notify: true, 
        data: { 
          settings_override: { 
            audio: {
              mic_default_on: call.microphone.enabled,
              default_device: 'speaker',
            },
            video: {
              camera_default_on: call.camera.enabled,
              target_resolution: {
                width: 640,
                height: 480
              }
            },
  
          }
        }
      })
      setSetupComplete(true)
    })
  }, [call, setSetupComplete])

  const joinMeeting = async () => {
    if(call?.type === 'private-meeting' && !call?.isCreatedByMe){
      if(!userId) return
      setPendingAccess(true)
      requestPrivateCallAccess({ username: `${user?.fullName}`, roomId: callId, userId })
    } else{
      await call.join({ 
        notify: true, 
        data: { 
          settings_override: { 
            audio: {
              mic_default_on: call.microphone.enabled,
              default_device: 'speaker',
            },
            video: {
              camera_default_on: call.camera.enabled,
              target_resolution: {
                width: 640,
                height: 480
              }
            },
  
          }
        }
      })
      setSetupComplete(true)
    }
  }

  const { userId } = useAuth()


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
        <VideoPreview className='!w-[600px] border-none' DisabledVideoPreview={DisabledVideoPreview} NoCameraPreview={NoVideoPreview} />
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
        
        <div className='flex items-center group'>
          <Button size={'lg'} onClick={joinMeeting} className='m-auto hover:group-first:bg-red-500' disabled={pendingAccess}>{pendingAccess ? <ClipLoader color="#fff" size={15} /> : "Join Meeting"}</Button>
          {/* <Button size={'lg'} onClick={joinPrivateMeeting} className='m-auto'>Join Private Meeting</Button> */}
        </div>
      </div>
    </div>
  )
}


export default MeetingSetup