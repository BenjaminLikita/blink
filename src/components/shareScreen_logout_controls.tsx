import { ReactionsButton, defaultReactions, useCall, useCallStateHooks, DefaultReactionsMenu } from '@stream-io/video-react-sdk'
import React from 'react'
import { Mic, MoreVerticalIcon, Video, Check, MicOff, VideoOff, Share, MonitorOff, Smile, Router } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogoutCurve } from 'iconsax-react';
import { ICallLayout } from '@/app/(root)/meeting/[id]/page';
import { useRouter } from 'next/navigation';

const ShareScreenLogoutControls = ({setLayout}:{setLayout: (layout: ICallLayout) => void}) => {
  const router = useRouter()
  const call = useCall()

  if(!call) throw new Error('Use Call must be used within StreamCallComponent')

  const { useHasOngoingScreenShare } = useCallStateHooks()

  const hasOngoingScreenShare = useHasOngoingScreenShare()

  const leaveCall = () => {
    call.endCall()
    router.push('/meeting')
  }

  const toggleShareScreen = () => {
    if(hasOngoingScreenShare){
      call.screenShare.disable()
    } else {
      call.screenShare.enable()
    }
  }
  const customEmojiReactionMap = {
    ...defaultReactions,
    // ...defaultEmojiReactionMap,
    ":lol:": "😂",
  };
  return (
    <div className='flex gap-3'>
      {/* SHARE SCREEN */}
      <div className='border border-white/30 flex divide-x divide-white/30 rounded-lg'>
        <span className='p-2 cursor-pointer' onClick={toggleShareScreen}>
          {
            hasOngoingScreenShare ? (
              <MonitorOff color='white' size={20} />
            ) : (
              <Share color='white' size={20} />
            )
          }
        </span>  
      </div>

      <div className='border border-white/30 flex  rounded-lg'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className='p-2 cursor-pointer'>
              <Smile color='white' size={20} />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-secondary border-none truncate'>
            <DefaultReactionsMenu reactions={defaultReactions} />
          </DropdownMenuContent>
          
        </DropdownMenu>
      </div>

      {/* LEAVE CALL */}
      <div className='bg-[#fa6037] flex rounded-lg'>
        <span className='p-2 cursor-pointer' onClick={leaveCall}>
          <LogoutCurve color='white' size={20} />
        </span>
      </div>
    </div>
  )
}

export default ShareScreenLogoutControls