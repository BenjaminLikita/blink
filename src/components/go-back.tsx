'use client'

import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const GoBack = () => {
  const router = useRouter()
  const goBack = () => {
    console.log(document.referrer)
    if (document.referrer) {
      router.back()
    } else {
      router.push('/')
    }
  }
  return (
    <Button onClick={goBack} className='rounded-full'><ArrowLeft color='white' /> Go Back</Button>
  )
}

export default GoBack