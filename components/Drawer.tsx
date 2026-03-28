"use client";

import Image from "next/image";
import { Drawer } from "vaul";
import { resources } from '@/constants';
import Link from 'next/link';
import { SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";

export function MyDrawer() {

    return (
        <Drawer.Root shouldScaleBackground>
            <Drawer.Trigger asChild>
                <button>
                    <Image src={'/icons/hamburger.svg'} width={24} height={24} alt="menu" className="" />
                </button>
            </Drawer.Trigger>
            <Drawer.Portal >
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="bg-gray-900 text-xl text-neutral-300 flex flex-col rounded-t-[10px] h-full mt-24 max-h-[96%] fixed bottom-0 left-0 right-0 z-40">
                    <div className="p-4 bg-gradient-to-b from-transparent to-black rounded-t-[10px] flex-1">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                        <div className="flex flex-col items-center justify-center gap-4">
                            <Drawer.Title className="font-medium mb-4">
                                Menu
                            </Drawer.Title>
                            <SignedOut>
                                <Drawer.Close asChild>
                                    <Link
                                        href='/sign-in'
                                        className="button-style"
                                    >
                                        Sign In
                                    </Link>
                                </Drawer.Close>
                                <Drawer.Close asChild>
                                    <Link
                                        href='/sign-up'
                                        className="button-style"
                                    >
                                        Sign Up
                                    </Link>
                                </Drawer.Close>
                            </SignedOut>

                            <SignedIn>
                                <Drawer.Close asChild>
                                    <Link
                                        href='/home/schedule-interview'
                                        className="button-style"
                                    >
                                        Schedule Interview
                                    </Link>
                                </Drawer.Close>
                                <Drawer.NestedRoot>
                                    <Drawer.Close asChild>
                                        <Drawer.Trigger className="button-style">
                                            Practice Interview
                                        </Drawer.Trigger>
                                    </Drawer.Close>
                                    <Drawer.Portal>
                                        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                                        <Drawer.Content className="text-xl z-50 bg-gray-900 flex flex-col rounded-t-[10px] h-full mt-24 max-h-[94%] fixed bottom-0 left-0 right-0">
                                            <div className="p-4 bg-gradient-to-b from-transparent to-black rounded-t-[10px] flex-1">
                                                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <Drawer.Title className="font-medium mb-4 text-neutral-300">
                                                        Practice Interview
                                                    </Drawer.Title>

                                                    <div className="flex flex-col items-center justify-center gap-4">

                                                        <Drawer.Close asChild>
                                                            <Link
                                                                href='/home/practice-interview/?type=dsa'
                                                                className="button-style"
                                                            >
                                                                DSA
                                                            </Link>
                                                        </Drawer.Close>
                                                        <Drawer.Close asChild>
                                                            <Link
                                                                href='/home/practice-interview/?type=webdev'
                                                                className="button-style"
                                                            >
                                                                Web development
                                                            </Link>
                                                        </Drawer.Close>
                                                        <Drawer.Close asChild>
                                                            <Link
                                                                href='/home/practice-interview/?type=consulting'
                                                                className="button-style"
                                                            >
                                                                Consulting
                                                            </Link>
                                                        </Drawer.Close>

                                                    </div>
                                                </div>
                                            </div>
                                            <Drawer.Close>
                                                <div className="p-2 text-neutral-300">
                                                    Close
                                                </div>
                                            </Drawer.Close>
                                        </Drawer.Content>
                                    </Drawer.Portal>
                                </Drawer.NestedRoot>
                            </SignedIn>
                            <Drawer.NestedRoot>
                                <Drawer.Trigger className="button-style">
                                    Resources
                                </Drawer.Trigger>
                                <Drawer.Portal>
                                    <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                                    <Drawer.Content className="text-xl z-50 bg-gray-900 flex flex-col rounded-t-[10px] h-full mt-24 max-h-[94%] fixed bottom-0 left-0 right-0">
                                        <div className="p-4 bg-gradient-to-b from-transparent to-black rounded-t-[10px] flex-1">
                                            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <Drawer.Title className="font-medium mb-4 text-neutral-300">
                                                    Resources
                                                </Drawer.Title>
                                                {resources.map((resource, index) => (
                                                    <div key={index} className="mb-4">
                                                        <a href={resource.href} target="_blank" className="text-blue-500 underline">
                                                            {resource.title}
                                                        </a>
                                                        <p className="text-gray-600">{resource.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <Drawer.Close>
                                            <div className="p-2 text-neutral-300">
                                                Close
                                            </div>
                                        </Drawer.Close>
                                    </Drawer.Content>
                                </Drawer.Portal>
                            </Drawer.NestedRoot>
                        </div>
                    </div>
                    <Drawer.Close>
                        <div className="p-2">
                            Close
                        </div>
                    </Drawer.Close>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}