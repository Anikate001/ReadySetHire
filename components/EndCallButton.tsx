"use client";

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import React from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const EndCallButton = () => {

    const router = useRouter();

    const call = useCall();

    const { useLocalParticipant } = useCallStateHooks();
    const localParticipant = useLocalParticipant();

    const isMeetingOwner = localParticipant && call?.state.createdBy &&
        call.state.createdBy.id === localParticipant.userId;

    if (!isMeetingOwner) return null;

    return (
        <Button onClick={async () => {
            await call.endCall();
            router.push('/home');
        }} className=' bg-red-600 cursor-pointer rounded-2xl hover:bg-red-500 px-4 py-2 transition-all'>
            End call for everyone
        </Button>
    )
}

export default EndCallButton