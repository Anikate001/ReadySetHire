import Image from 'next/image';
import React from 'react';

type ImagePosition = 'left' | 'right' | 'bottom';

const HeroSection = ({
    heading,
    subHeading,
    imageUrl,
    position,
    ctaText,
    ctaLink,
}: {
    heading: string;
    subHeading: string;
    imageUrl: string;
    position: ImagePosition;
    ctaText: string;
    ctaLink: string;
}) => {
    return (
        <div className="h-screen w-full relative flex flex-col justify-center items-center bg-gray-900 text-white overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent to-black opacity-50"></div>
            <div className={`relative z-20 w-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row ${position === 'bottom'? 'md:flex-col' : ''}`}>
                {position === 'left' && (
                    <>
                        <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left md:w-1/2 pr-10">
                            <h1 className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
                                {heading}
                            </h1>
                            <p className="mt-4 text-lg font-light text-neutral-400">
                                {subHeading}
                            </p>
                            <a href={ctaLink} className="mt-8 inline-block bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition">
                                {ctaText}
                            </a>
                        </div>
                        <div className="hidden md:block md:w-1/2">
                            <Image src={imageUrl} width={600} height={600} alt={heading} className="rounded-xl object-cover" />
                        </div>
                    </>
                )}
                {position === 'right' && (
                    <>
                        <div className="hidden md:block md:w-1/2">
                            <Image src={imageUrl} width={600} height={600} alt={heading} className="rounded-xl object-cover" />
                        </div>
                        <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left md:w-1/2 pl-10">
                            <h1 className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
                                {heading}
                            </h1>
                            <p className="mt-4 text-lg font-light text-neutral-400">
                                {subHeading}
                            </p>
                            <a href={ctaLink} className="mt-8 inline-block bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition">
                                {ctaText}
                            </a>
                        </div>
                    </>
                )}
                {position === 'bottom' && (
                    <>
                        <div className="w-full text-center">
                            <h1 className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
                                {heading}
                            </h1>
                            <p className="mt-4 text-lg font-light text-neutral-400">
                                {subHeading}
                            </p>
                            <a href={ctaLink} className="mt-8 inline-block bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition">
                                {ctaText}
                            </a>
                        </div>
                        <div className="w-full mt-8">
                            <Image src={imageUrl} width={600} height={600} alt={heading} className="rounded-xl object-cover mx-auto" />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HeroSection;
