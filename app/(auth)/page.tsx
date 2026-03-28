"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import HeroSection from '@/components/HeroSection';
import { GridBackground } from '@/components/ui/grid-background';

const LandingPage = () => {
    const { isLoaded, isSignedIn } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push('/home');
        }
    }, [isLoaded, isSignedIn, router]);

    return (
        <div className='overflow-hidden'>
            <GridBackground />
            <HeroSection
                heading='Tailored Interview Questions'
                subHeading='Select your job description to receive custom interview questions tailored to your domain.'
                imageUrl='/images/meet-vue.PNG'
                position='bottom'
                ctaText='Get Started'
                ctaLink='/home'
            />
            <HeroSection
                heading='Practice Makes Perfect'
                subHeading='Improve your interview skills with unlimited AI generated practice questions.'
                imageUrl='/images/meet-vue.PNG'
                position='left'
                ctaText='Sign In'
                ctaLink='/sign-in'
            />
            <HeroSection
                heading='Schedule Interviews'
                subHeading='Schedule a future interview and invite your peers with a link.'
                imageUrl='/images/meet-vue.PNG'
                position='right'
                ctaText='Schedule Interview'
                ctaLink='/home/schedule-interview'
            />
        </div>
    );
}

export default LandingPage;
