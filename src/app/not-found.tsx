import GoBack from '@/components/go-back'
import React from 'react'

const ErrorPage = () => {
  return (
    <div className='flex justify-center items-center h-screen flex-col gap-5'>
      <div className='relative'>
        <h1 className='font-extrabold text-9xl'>404!</h1>
        <p className='font-semibold text-3xl text-center text-white/30 absolute top-[50%] -translate-y-[50%] left-[50%] w-full -translate-x-[50%]'>Page Not found</p>
      </div>

      <GoBack />
    </div>
  )
}

export default ErrorPage