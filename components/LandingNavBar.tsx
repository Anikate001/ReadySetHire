"use client"

import * as React from "react"
import Link from "next/link"
import { useUser, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import NavButton from "./NavButton"
import { resources } from "@/constants"

export function LandingNavBar() {
    // const { user } = useUser();

    return (
        <NavigationMenu className=" text-neutral-300 px-4 md:px-6 py-1">
            <NavigationMenuList className="flex items-center justify-between">

                <SignedOut>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="hover:text-white hover:underline underline-offset-4 transition-all rounded-full">Getting started</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-3">
                                    <NavigationMenuLink asChild>
                                        <a
                                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gray-800 bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                            href="/"
                                        >
                                            <div className="mb-2 mt-4 text-lg font-medium">
                                                ReadySetHire
                                            </div>
                                            <p className="text-sm leading-tight text-muted-foreground">
                                                AI-powered mock interviews. Practice with your peers. Invite them with a link.
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                                <ListItem href="/home" title="Introduction">
                                    Choose from a range of different topics like DSA & many more!
                                </ListItem>
                                <ListItem href="/sign-in" title="Sign In">
                                    Sign In to give mock interviews with your peers.
                                </ListItem>
                                <ListItem href="/sign-up" title="Sign Up">
                                    Join us and give your career the best shot!
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </SignedOut>


                <SignedIn>
                    <NavigationMenuItem className="hover:text-white hover:underline underline-offset-4 transition-all rounded-full">
                        <Link href="/ai-interview" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                AI Interview
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="hover:text-white hover:underline underline-offset-4 transition-all rounded-full">
                        <Link href="/home/schedule-interview" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Schedule Interview
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="hover:text-white hover:underline underline-offset-4 transition-all rounded-full">Practice Interview</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-3">
                                    <NavigationMenuLink asChild>
                                        <a
                                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gray-800 bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                            href="/home"
                                        >
                                            <div className="mb-2 mt-4 text-lg font-medium">
                                                ReadySetHire
                                            </div>
                                            <p className="text-sm leading-tight text-muted-foreground">
                                                <p>Start an instant meeting.</p> AI-powered mock interviews. Practice with your peers. Invite them with a link.
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                                <ListItem href="/home/practice-interview/?type=dsa" title="DSA">
                                    Choose from a range of different topics like DSA & many more!
                                </ListItem>
                                <ListItem href="/home/practice-interview/?type=webdev" title="Web development">
                                    Sign In to give mock interviews with your peers.
                                </ListItem>
                                <ListItem href="/home/practice-interview/?type=consulting" title="Case Study Interview">
                                    Join us and give your career the best shot!
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </SignedIn>


                <NavigationMenuItem>
                    <NavigationMenuTrigger className="hover:text-white hover:underline underline-offset-4 transition-all rounded-full">Resources</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {resources.map((resource) => (
                                <ListItem
                                    key={resource.title}
                                    title={resource.title}
                                    href={resource.href}
                                >
                                    {resource.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>


                <SignedOut>
                    <NavigationMenuItem className="hover:text-white hover:underline underline-offset-4 transition-all rounded-full">
                        <Link href="/sign-in" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                SignIn
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="hover:text-white hover:underline underline-offset-4 transition-all rounded-full">
                        <Link href="/sign-up" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                SignUp
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </SignedOut>


                <SignedIn>
                    <NavigationMenuItem className="transition-all rounded-full">
                        <UserButton afterSignOutUrl="/" />
                    </NavigationMenuItem>
                </SignedIn>


                <NavigationMenuItem>
                    <Link href="https://github.com/Anikate001/ReadySetHire" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <NavButton title="GitHub" />
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>


            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none  hover:bg-gradient-to-r from-blue-700 to-teal-700 transition-all hover:text-white focus:text-white",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
