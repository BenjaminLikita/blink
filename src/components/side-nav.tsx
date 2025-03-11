'use client'
import { Calendar, Home2, Notification, People, Setting2, Video } from 'iconsax-react'
import Image from 'next/image'
import React from 'react'
import logo from '@/assets/logo.png'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

const SideNav = () => {
  const pathname = usePathname()
  const links = [
    { icon: Home2, title: "Home", href: '/', isActive: pathname === '/' },
    { icon: Video, title: "Meeting", href: '/meeting', isActive: pathname === '/meeting' },
    { icon: People, title: "All Meetings", href: '/all-meetings', isActive: pathname === '/all-meetings' },
    { icon: Calendar, title: "Schedule", href: '/recordings', isActive: pathname === '/recordings' },
    { icon: Notification, title: "Notifications", href: '/notifications', isActive: pathname === '/notifications' },
    { icon: Setting2, title: "Settings", href: '/settings', isActive: pathname === '/settings' }
  ]
  
  return (
    <div className='h-screen w-[80px] flex flex-col justify-between items-center p-5 pb-5 md:pb-32'>
      <div>
        <Image src={logo} alt='blink-logo' />
      </div>
      <div className='flex flex-col gap-10'>
        {
          links.map((link, index) => (
            <Link href={link.href} key={index}>
              <link.icon color={link.isActive ? '#18e6de' : 'white'} size={28} className='hover:scale-[1.2] transition-all duration-300' variant={link.isActive ? 'Bold' : 'Linear'}  />
            </Link>
          ))
        }
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  )
}

export default SideNav