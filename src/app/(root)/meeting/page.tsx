'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Copy } from 'iconsax-react'
import { Keyboard, Link, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useStreamVideoClient } from '@stream-io/video-react-sdk'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { nanoid } from 'nanoid'

const Meeting = () => {
  const [code, setCode] = useState('')

  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalCode, setModalCode] = useState('')

  const joinMeetingWithId = () => {
    router.push(`/meeting/${code}`)
  }

  const client = useStreamVideoClient()!

  const createCall = async () => {
    const callId = nanoid(6)

    const call = client.call('default', callId)
    await call.getOrCreate({
      data: {
        starts_at: new Date().toISOString(),
        custom: {
          description: 'Instant Meeting',
          link: ''
        }
      }
    })

    router.push(`/meeting/${call.id}`)
  }

  const scheduleCall = async () => {
    const callId = nanoid(6)

    const call = client.call('default', callId)
    await call.getOrCreate({
      data: {
        starts_at: new Date().toISOString(),
        custom: {
          description: 'Instant Meeting',
          link: ''
        }
      }
    })

    await call.getOrCreate({
      data: {
        starts_at: new Date().toISOString(),
        custom: {
          description: 'Instant Meeting',
          link: ''
        }
      }
    })

    setModalCode(call.id)
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
              <DropdownMenuItem className='hover:!bg-white/20 cursor-pointer' onClick={scheduleCall}><Link /> Create a Meeting for later</DropdownMenuItem>
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
      {/* <h1 className='text-4xl font-light text-white/80 text-center'>Get Started</h1>
      <p className='text-gray-500'>This is the meeting page.</p> */}
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