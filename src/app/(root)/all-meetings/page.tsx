'use client'


import Link from 'next/link'
import React from 'react'
import { dateToTime, formatDate } from '@/utils/helpers'
import useGetCalls from '@/hooks/useGetCalls'
import Image from 'next/image'
import logo from '@/assets/logo.png'


const AllMeetings = () => {
  
  const { calls: meetings, isLoading: loadingMeetings } = useGetCalls()

  return (
    <main>
      <div className='mt-20'>
        <div className='flex items-center justify-between border-b pb-10 border-white/40 p-4'>
          <h1 className='font-medium text-3xl'>Meeting History</h1>
        </div>
        {
          loadingMeetings ? (
            <div className='h-[60vh] grid place-items-center'>
              <Image width={50} className='animate-bounce' src={logo} alt='blink-logo' />
            </div>
          ) : !meetings || meetings?.length === 0 ? (
            <div className='h-[70vh] grid place-items-center'>
              <h1 className='font-semibold text-3xl'>No Meetings found</h1>
            </div>
          ) : meetings.map(({state, id}) => (
            <div key={id} className='flex gap-5 items-center py-2 text-sm border-b border-white/40'>
              <h1>{dateToTime(state.createdAt)}</h1>
              <div className='flex-[1]'>
                <p>{formatDate(state.createdAt)}</p>
                <h1 className='font-semibold text-xl'>{state.custom.description}</h1>
                <p>Meeting ID: {id}</p>
              </div>
              <Link href={`/meeting/${id}`} className='hover:underline text-base m-5'>Join</Link>
            </div>
          ))
        }
      </div>
    </main>
  )
}

export default AllMeetings