'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Copy } from 'iconsax-react'
import { Keyboard, Link as LinkIcon, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useStreamVideoClient } from '@stream-io/video-react-sdk'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { nanoid } from 'nanoid'
import { api } from '@/trpc/react'
import Link from 'next/link'
import { dateToTime, formatDate } from '@/utils/helpers'
import useGetCalls from '@/hooks/useGetCalls'
import { useAuth } from '@clerk/nextjs'
import { joinRoom } from '@/hooks/use-websocket'

const Meeting = () => {
  const [code, setCode] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const { mutateAsync: createMeeting } = api.meeting.create.useMutation()
  // const { mutateAsync: joinMeeting } = api.meeting.join.useMutation()
  

  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalCode, setModalCode] = useState('')
  const { userId } = useAuth()

  const joinMeetingWithId = async () => {
    setIsLoading(true)
    const { calls } = await client.queryCalls({ 
      filter_conditions: { id: code }
    })
    const call = calls[0]
    if(!call){
      setIsLoading(false)
      return
    }

    // await joinMeeting({ meetingId: call.id })
    router.push(`/meeting/${code}`)
  }

  const client = useStreamVideoClient()!
  const { calls: meetings, isLoading: loadingMeetings } = useGetCalls()

  const createCall = async () => {
    const callId = nanoid(6)

    const call = client.call('private-meeting', callId)

    // call.updateCallMembers({
    //   update_members: [ { user_id: "userId", role: 'host' } ]
    // })
    // call.updateUserPermissions({
    //   grant_permissions: ['join', 'publish', 'subscribe'],
    //   user_id: "userId"
    // })
    
    await call.getOrCreate({
      data: {
        starts_at: new Date().toISOString(),
        custom: {
          description: 'Instant Meeting',
          link: ''
        },
        // settings_override: {
        //   backstage: {
        //     enabled: false
        //   },
        //   video: {
        //     access_request_enabled: true
        //   }
        // },
        members: [
          { user_id: userId!, role: 'call_member' }
        ]
      },
    })

    if(call?.id){
      await createMeeting({
        name: "Instant Meeting",
        streamId: call.id,
      })
      
      router.push(`/meeting/${call.id}`)
    }
  }

  const scheduleCall = async () => {
    const callId = nanoid(6)

    // const call = client.call('default', callId)
    const call = client.call('private-meeting', callId)
    joinRoom(callId)
    await call.getOrCreate({
      data: {
        starts_at: new Date().toISOString(),
        custom: {
          description: 'Instant Meeting',
          link: ''
        },
        members: [
          
        ]
      }

    })

    if(call?.id) {
      // await createMeeting({
      //   name: "Instant Meeting",
      //   streamId: call.id,
      // })
      setModalCode(call.id)
    }
    setIsModalOpen(true)
  }

  return (
    <div className='p-5'>
      <div className='flex gap-3 items-center justify-center w-full my-5 md:my-10'>
        <Image width={100} src={logo} alt='blink-logo' />
        <h1 className='text-2xl font-bold'>Blink</h1>
      </div>
      
      <div className='w-full max-w-[39rem] m-auto space-y-6'>

        <h1 className='text-[2rem] md:text-[2.815rem] leading-[2rem] md:leading-[3.25rem] font-light text-white text-center'>Video calls and meetings for everyone</h1>
        <p className='font-light text-center text-white/70'>Connect and collaborate from anywhere with Blink</p>

        <div className='flex justify-between items-center gap-x-5 gap-y-2  flex-wrap'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='rounded-full hover:scale-[1.04] hover:shadow-sm hover:bg-primary transition-all duration-300'><Plus color='#fff' />New Meeting</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-secondary border-none text-white">
              <DropdownMenuItem className='hover:!bg-white/20 cursor-pointer' onClick={scheduleCall}><LinkIcon /> Create a Meeting for later</DropdownMenuItem>
              <DropdownMenuItem className='hover:!bg-white/20 cursor-pointer' onClick={createCall}><Plus /> Start an Instant meeting</DropdownMenuItem>
              <DropdownMenuItem className='hover:!bg-white/20 cursor-pointer'>Item 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className='relative flex-[1] min-w-[200px]'>
            <Keyboard className='absolute top-[50%] -translate-y-[50%] left-2' size={25} color='gray' />
            <Input placeholder='Enter meeting code' className='p-5 pl-10 font-light !text-lg. border-white/40 rounded-xl w-full' onChange={(e) => setCode(e.target.value)} />
          </div>
          <Button variant={'ghost'} className='rounded-full !p-0 hover:scale-[1.04] hover:shadow-sm !bg-transparent hover:!bg-[#18e6df23] hover:!text-primary transition-all' disabled={code.length === 0} onClick={joinMeetingWithId}>Join</Button>
        </div>
      </div>
      
      <div className='mt-20'>
        <div className='flex items-center justify-between border-y border-white/40 p-4'>
          <h1 className='font-medium text-xl'>Meeting History</h1>
          <Link href={'/all-meetings'} className='underline'>See all</Link>
        </div>
        {
          loadingMeetings ? (
            <div className='h-[30vh] grid place-items-center'>
              <Image width={50} className='animate-bounce' src={logo} alt='blink-logo' />
            </div>
          ) : !meetings || meetings?.length === 0 ? (
            <div className='h-[30vh] grid place-items-center'>
              <h1>No Meetings found</h1>
            </div>
          ) : meetings.slice(0, 5).map(({id, state}) => (
            <div key={id} className='flex gap-5 items-center py-2 text-sm border-b border-white/40'>
              <h1>{dateToTime(state.createdAt)}</h1>
              <div>
                <p>{formatDate(state.createdAt)}</p>
                <h1 className='font-semibold text-xl'>{state.custom.description}</h1>
                <p>Meeting ID: {id}</p>
              </div>
            </div>
          ))
        }
      </div>

      <LoadingModal isOpen={isLoading} />
      <MeetingModal code={modalCode} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Meeting



const MeetingModal = ({isOpen, onClose, code}:{isOpen: boolean, onClose: () => void, code: string}) => {
  const { toast } = useToast()
  const copyMeetingLink = async () => {
    toast({ description: 'Meeting Link copied!', color: 'red', className: "bg-[#161c21] text-white border-none" })
    await navigator.clipboard.writeText(`http://localhost:3000/meeting/${code}`)
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-[90%] md:w-[50%] !bg-secondary border-none text-white/60'>
        <DialogHeader>
          <DialogTitle className='font-extralight text-4xl'>{`Here's your joining info`}</DialogTitle>
        </DialogHeader>
        <div className='font-thin'>
          <p>Share this link with people you want to meet with.</p>
          <p>Be sure to save it so you can use it later</p>
          <div className='bg-[#161c21] opacity-55 p-3 rounded-xl flex gap-5'>
            <p className='text-left line-clamp-1 flex-[1]'>http://localhost:3000/meeting/{code}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className='cursor-pointer' onClick={copyMeetingLink}>
                    <Copy color='white' size={20} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className='bg-[#161c21]'>
                  <p>Copy link</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const LoadingModal = ({isOpen}:{isOpen: boolean}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className='border-none text-white/60 bg-transparent flex flex-col items-center justify-center'>
        <AlertDialogTitle></AlertDialogTitle>
        <Image src={logo} width={100} className='animate-bounce' alt='blink-logo' />
        <h1 className='text-2xl font-bold'>Loading Call...</h1>
      </AlertDialogContent>
    </AlertDialog>
  )
}