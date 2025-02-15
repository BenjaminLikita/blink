'use client'
import { Calendar, Home2, LogoutCurve, Notification, People, Setting2, Video } from 'iconsax-react'
import Image from 'next/image'
import React from 'react'
import logo from '@/assets/logo.png'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'

const SideNav = () => {
  const pathname = usePathname()
  const links = [
    { icon: Home2, title: "Home", href: '/dashboard' },
    { icon: Video, title: "Meeting", href: '/meeting' },
    { icon: People, title: "Friends", href: '/friends' },
    { icon: Calendar, title: "Schedule", href: '/schedule' },
    { icon: Notification, title: "Notifications", href: '/notifications' },
    { icon: Setting2, title: "Settings", href: '/settings' }
  ]

  const logoutDetails = { icon: LogoutCurve, title: "Settings", href: '/settings' }
  const isActive = (path: string) => {
    return pathname.includes(path)
  }
  
  const { signOut } = useClerk()
  return (
    <div className='h-screen w-[80px] flex flex-col justify-between items-center p-5 pb-5 md:pb-32'>
      <div>
        <Image src={logo} alt='blink-logo' />
      </div>
      <div className='flex flex-col gap-10'>
        {
          links.map((link, index) => (
            <Link href={link.href} key={index}>
              <link.icon color={isActive(link.href) ? '#18e6de' : 'white'} size={28} className='hover:scale-[1.2] transition-all duration-300' variant={isActive(link.href) ? 'Bold' : 'Linear'}  />
            </Link>
          ))
        }
      </div>
      <div>
        <button onClick={() => signOut()}>
          <logoutDetails.icon color='white' size={30} className='hover:scale-[1.2] transition-all duration-300'  />
        </button>
      </div>
    </div>
  )
}

export default SideNav