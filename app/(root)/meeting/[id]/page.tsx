"use client";

import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation';

type InterviewType = 'dsa' | 'webdev' | 'consulting';

const Meeting = ({ params: { id } }: { params: { id: string } }) => {

  const { user, isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const searchParams = useSearchParams();
  const interviewType = (searchParams.get('interviewType') as InterviewType);

  const { call, isCallLoading } = useGetCallById(id);

  if (!isLoaded || isCallLoading) return <Loader />

  return (
    <main className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <>
              {interviewType ? <MeetingRoom type={interviewType} /> : <MeetingRoom />}
            </>
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting
