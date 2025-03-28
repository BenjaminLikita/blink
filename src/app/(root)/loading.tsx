import React from 'react'
import logo from '@/assets/logo.png'
import Image from 'next/image'


const Loading = () => {
  return (
    <div className='h-screen grid place-items-center'>
      <Image width={100} className='animate-bounce' src={logo} alt='blink-logo' />
    </div>
  )
}

export default Loading