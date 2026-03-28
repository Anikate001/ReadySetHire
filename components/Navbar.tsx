import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import MobileNav from './MobileNav'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { MenuIcon, VideoIcon } from 'lucide-react'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <header className="bg-gray-900 text-white px-4 md:px-6 py-3 flex items-center justify-between">
      <Link className="flex items-center gap-2" href="#">
        <VideoIcon className="w-6 h-6 text-teal-400" />
        <span className="text-lg font-semibold text-teal-400">InterviewFlow</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link className="hover:text-teal-400 transition duration-300" href="#">
          Schedule Interview
        </Link>
        <Link className="hover:text-teal-400 transition duration-300" href="#">
          Past Interviews
        </Link>
        <Link className="hover:text-teal-400 transition duration-300" href="#">
          Resources
        </Link>
      </nav>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <Button className="hidden md:inline-flex bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
        Start Interview
      </Button>
      <Button className="md:hidden bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded transition duration-300" size="icon">
        <MenuIcon className="w-6 h-6" />
      </Button>
    </header>
  )
}

export default Navbar
