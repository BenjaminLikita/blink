'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate, formatDurationBetweenDates } from '@/lib/utils'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { HardDriveDownload, Share2, Trash } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import logo from '@/assets/logo.png'
import Image from 'next/image'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

interface ICallRecording{
  id: string
  sessionId: string
  callId: string
  name: string
  type: string
  url: string
  duration: string
  filename: string
  date: string
}

interface IRecording{
  end_time: string
  filename: string
  session_id: string
  start_time: string
  url: string
}
const Recordings = () => {
  const tableHead = ['', 'Name', 'Duration', 'Date', 'Status']

  const [recordings, setRecordings] = useState<ICallRecording[]>([])
  const [callData, setCallData] = useState<{ session: string, callId: string, filename: string }>({ session: '', callId: '', filename: '' })
  // const [deleteRecordingId, setDeleteRecordingId] = useState<string>('')
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [loadingRecordings, setLoadingRecordings] = useState(false)
  const client = useStreamVideoClient()
  
  useEffect(() => {
    const getRecordings = async () => {
      setLoadingRecordings(true)
      
      if(!client) return
      const { calls } = await client.queryCalls()
      // const { calls } = await client.queryCalls({ filter_conditions: { created_by_user_id: userId } })
      calls.map(async (call: Call) => {
        const { recordings } = await call.queryRecordings() as unknown as { recordings: IRecording[] }

        const formattedRecordings = recordings.map(recording => {
          const splitFilename = recording.filename.split('_')
          const type = splitFilename[1]!
          const id = splitFilename[4]!
          const startTime = new Date(recording.start_time)
          const endTime = new Date(recording.end_time)
          const duration = formatDurationBetweenDates(startTime, endTime)
          const date = formatDate(recording.start_time)

          return {
            duration,
            name: call.state.custom.description,
            callId: call.id,
            filename: recording.filename,
            id,
            sessionId: recording.session_id,
            type,
            url: recording.url,
            date
          }
        })

        setRecordings(prev => ([...prev, ...formattedRecordings]))
        setLoadingRecordings(false)
      })
    }
    getRecordings()
  }, [client])

  const deleteRecording = ({session, callId, filename}: { session: string, callId: string, filename: string }) => {
    setOpenDeleteModal(true)
    setCallData({ session, callId, filename })
  }
  
  const closeRecordingDialog = () => {
    setOpenDeleteModal(false)
    setCallData({ session: '', callId: '', filename: '' })
  }

  return (
    <div className='p-5'>
      <h1 className='font-semibold text-3xl'>Recordings</h1>

      <div className='flex items-center justify-between border-white/40 p-4'>
        <h1>{`Recordings(${recordings?.length})`}</h1>
        <div>
          <Input type="text" className='border-white/20 text-white/70' placeholder='Search Recordings' />
        </div>
        {/* <div className='flex gap-5 items-center'>
          <h1>{"Recordings(4)"}</h1>
          <div>
            <input type="text" placeholder='Search Recordings' />
          </div>
        </div> */}
      </div>

      <table className='w-full my-'>
        <thead className='border-b border-white/40'>
          <tr>
            {
              tableHead.map(title => (
                <th key={title} className='text-white/80 text-left'>{title}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            loadingRecordings ? (
              <tr>
                <td colSpan={6}>
                  <div className='h-[60vh] grid place-items-center'>
                    <Image width={100} className='animate-bounce' src={logo} alt='blink-logo' />
                  </div>
                </td>
              </tr>
            ) : !recordings || recordings?.length === 0 ? (
              <tr>
                <td colSpan={6}>
                <div className='h-[60vh] grid place-items-center'>
                  <h1 className='font-semibold text-3xl'>No Recordings found</h1>
                </div>
                </td>
              </tr>
            ) : recordings?.map(({ duration, name, callId, type, url, date, sessionId, filename }, index) => (
              <tr key={index} className='border-b border-white/40'>
                <td className='py-5'>
                  <button>play</button>
                </td>
                <td>
                  <div>
                    <h1 className='font-medium'>{name}</h1>
                    <p className='font-light text-white/60'>{callId}</p>
                  </div>
                </td>
                <td>{duration}</td>
                <td>{date}</td>
                <td>{type === 'private-meeting' ? 'Private Video' : type === 'audio' ? 'Audio Room' : 'Public Video'}</td>
                <td>
                  <div className='flex gap-3 items-center'>
                    <Button variant='icon' asChild>
                      <Link href={url} download>
                        <HardDriveDownload />
                      </Link>
                    </Button>
                    <Button variant='icon'>
                      <Share2 />
                    </Button>
                    <Button variant='iconDestructive' onClick={() => deleteRecording({callId, session: sessionId, filename})}>
                      <Trash fill='hsl(0,84.2%,60.2%)' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <DeleteRecordingDialog isOpen={openDeleteModal} onClose={closeRecordingDialog} callData={callData}  />
    </div>
  )
}

export default Recordings



const DeleteRecordingDialog = ({isOpen, onClose, callData}:{isOpen: boolean, onClose: () => void, callData: { session: string, filename: string, callId: string } }) => {
  const client = useStreamVideoClient()
  const deleteRecording = async () => {
    // toast({ description: 'Recording deleted', color: 'green', className: "bg-[#161c21] text-white border-none" })
    
    if(!client) return

    const { calls } = await client.queryCalls({ filter_conditions: { id: callData.callId } })
    const call = calls[0] as Call
    if(!call) return
    //await call.deleteRecording({ session: callData.session, filename: callData.filename });
    
    // onClose()
  }
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className='w-[90%] md:w-[50%] !bg-secondary border-none text-white/60'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this recording?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this recording
            remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='bg-transparent'>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteRecording}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}