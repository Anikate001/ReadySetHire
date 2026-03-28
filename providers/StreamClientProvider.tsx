"use client";

import { useUser } from '@clerk/nextjs';
import {
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    User,
} from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;


const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {

    const [videoCliet, setVideoCliet] = useState<StreamVideoClient>();

    const {user, isLoaded} = useUser();

    useEffect(() => {
        if (!isLoaded || !user) return;
        if (!apiKey) throw new Error('Stream API key missing');

        const client = new StreamVideoClient({
            apiKey, 
            user: {
                id: user?.id, 
                name: user?.username || user?.id, 
                image: user?.imageUrl
            } ,
            tokenProvider
        })

        setVideoCliet(client);

    }, [user, isLoaded]);

    if (!videoCliet) return <Loader />

    return (
        <StreamVideo client={videoCliet}>
            {children}
        </StreamVideo>
    );
};

export default StreamVideoProvider;