"use client"

import { useClerk } from "@clerk/nextjs"
import Image from "next/image"

const DisabledVideoPreview = () => {
  const { user } = useClerk()
  return (
    <>
      {
        user && <Image width={100} height={100} className='rounded-full' src={user.imageUrl || '/user'} alt='preview-user' />
      }
    </>
  )
}

export default DisabledVideoPreview