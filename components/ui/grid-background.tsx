import React from "react";
import { FlipWords } from "./flip-words";
import Image from "next/image";

export function GridBackground() {
    const words = ['DSA', "Frontend", 'Consulting'];

    return (
        <div className="h-screen w-screen bg-transparent bg-grid-white/[0.1] relative flex justify-center max-md:items-center">
            <div className="absolute pointer-events-none inset-0 flex justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_1%,black)]"></div>
            <div className="mx-auto px-4 justify-center z-0 text-center">
                <div className="justify-center text-center md:pt-28">
                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400">
                        Ace your next <FlipWords words={words}  /> interview <br />with confidence.
                    </span>
                </div>
                <p className="mt-16 text-sm sm:text-lg md:text-xl text-neutral-400 w-full px-4 sm:px-10 md:px-20 lg:px-40 xl:px-60 text-center">
                    Practice your skills the way they are meant to be practiced - in a real interview setting.
                    ReadySetHire is a free platform that provides the most popular Data Structures & Algorithms,
                    Case Study and Front-end technical questions asked in an Interview generated with AI.
                </p>
            </div>
        </div>
    );
}
