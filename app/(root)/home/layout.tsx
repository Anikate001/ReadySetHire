import { MyDrawer } from '@/components/Drawer';
import Footer from '@/components/Footer';
import { LandingNavBar } from '@/components/LandingNavBar';
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { SignOutButton, SignedIn, UserButton } from '@clerk/nextjs';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
    title: "ReadySetHire",
    description: "Practice Mock Interviews with your peers",
    icons: {
        icon: '/icons/logo.svg'
    }
};

// this is new

const HomeLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main className='relative overflow-hidden'>
            <div className='w-screen flex items-center bg-black bg-opacity-50 justify-between text-neutral-200 p-2 md:px-14'>
                <div className=''>
                    <Link href={'/home'} className="flex gap-2 relative z-30">
                        <Image src={"/icons/logo.svg"} width={24} height={24} alt="ReadySetHire" />
                        <h2 className="font-bold">ReadySetHire</h2>
                    </Link>
                </div>
                <span className='hidden max-sm:block items-center justify-center'>
                    <div className='flex items-center justify-center gap-2 pr-4'>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <MyDrawer />
                    </div>
                </span>
                <span className='hidden md:block'><LandingNavBar /></span>
            </div>

            <div className='flex'>
                {/* <Sidebar /> */}

                <section className='flex min-h-screen flex-1 flex-col bg-gradient-to-b from-transparent to-black'>
                    <div className='w-full'>
                        {children}
                    </div>
                </section>

            </div>

            <Footer />
        </main>
    )
}

export default HomeLayout