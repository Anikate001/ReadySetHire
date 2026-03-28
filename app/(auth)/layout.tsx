"use client";

import { MyDrawer } from '@/components/Drawer';
import Footer from '@/components/Footer';
import { LandingNavBar } from '@/components/LandingNavBar';
import { SignOutButton, SignedIn } from '@clerk/clerk-react';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className='overflow-hidden '>
            <div className='w-screen flex items-center bg-black bg-opacity-50 justify-between text-neutral-200 p-2 md:px-14'>
                <div className=''>
                    <Link href={'/'} className="flex gap-2 relative z-10">
                        <Image src={"/icons/logo.svg"} width={24} height={24} alt="ReadySetHire" />
                        <h2 className="font-bold">ReadySetHire</h2>
                    </Link>
                </div>
                <span className='hidden max-sm:block relative z-30 pr-4'>

                    <MyDrawer />
                </span>
                <span className='hidden md:block'><LandingNavBar /></span>
            </div>
            {children}
            <Footer />
        </div>
    )
}

export default Layout