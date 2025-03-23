"use client"

import { socket } from "@/hooks/use-websocket"
import { ICallLayout } from "@/lib/types"
import { PaginatedGridLayout, RecordCallButton, SpeakerLayout, StreamCallEvent, useCall, useCallStateHooks } from "@stream-io/video-react-sdk"
import { useCallback, useEffect, useState } from "react"
import AudioVideoControls from "./audio_video_controls"
import ShareScreenLogoutControls from "./shareScreen_logout_controls"
import MenuParticipantsCount from "./menu_participants_controls"
import { Grid1, Grid5 } from "iconsax-react"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "../ui/toast"

const MeetingRoom = () => {
  const [layout, setLayout] = useState<ICallLayout>('speaker-left')
  const call = useCall()

  const acceptUser = useCallback(async ({ userId, roomId }: { userId: string, roomId: string }) => {
    if(!socket || !call) return
    await call.updateCallMembers({
      update_members: [ { user_id: userId, role: 'call_member' } ]
    })
    socket.emit('acceptedPrivateCallAccess', {roomId, userId})
  }, [call])

  useEffect(() => {
    if(!socket || !call) return
    
    socket.on('requestMessage', async (data: {username: string, roomId: string, userId: string}) => {
      const { userId, username, roomId } = data
      if(call?.isCreatedByMe) {
        const audio = new Audio('/assets/record_start.mp3')
        audio.play().catch(error => console.error(error))
        toast({
          title: `${username} is trying to join in`,
          // description: "Friday, February 10, 2023 at 5:57 PM",
          action: (
            <ToastAction altText="Goto schedule to undo" onClick={() => acceptUser({userId, roomId})}>Accept</ToastAction>
          ),
        })
      }
      
    })

    return () => {
      socket.off('roomMessage')
    }
  }, [call, acceptUser])


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


  call?.on("call.recording_started", async (_event: StreamCallEvent) => {
    toast({ description: 'Call recording started', color: 'green', className: "bg-[#161c21] text-white border-none" })
    const audio = new Audio('/assets/record_start.mp3')
    audio.play().catch(error => console.error(error))
  })

  call?.on("call.recording_stopped", async (_event: StreamCallEvent) => {
    toast({ description: 'Call recording stopped', color: 'green', className: "bg-[#161c21] text-white border-none" })
  })

  const { useHasOngoingScreenShare } = useCallStateHooks();
  const hasOngoingScreenshare = useHasOngoingScreenShare();

  useEffect(() => {
    if(hasOngoingScreenshare){
      setLayout("speaker-left")
    } else{
      setLayout("grid")
    }
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

      <div className='flex items-center w-full justify-between flex-wrap'>
        <AudioVideoControls />
        <RecordCallButton />
        <ShareScreenLogoutControls />
        <MenuParticipantsCount />
      </div>
    </div>
  )
}


export default MeetingRoom