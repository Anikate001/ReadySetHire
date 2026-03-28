'use client';

import { Call, CallRecording } from '@stream-io/video-react-sdk';
import Loader from './Loader';
import { useGetCalls } from '@/hooks/useGetCalls';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './ui/use-toast';
import { HoverEffect } from '@/components/ui/card-hover-effect';

interface CallListProps {
    type: 'ended' | 'upcoming' | 'recordings';
    isHomepage?: boolean;
}

const CallList = ({ type, isHomepage = false }: CallListProps) => {
    const router = useRouter();
    const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
    const [recordings, setRecordings] = useState<CallRecording[]>([]);
    const { toast } = useToast();

    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls;
            case 'recordings':
                return recordings;
            case 'upcoming':
                return upcomingCalls;
            default:
                return [];
        }
    };

    const getNoCallsMessage = () => {
        switch (type) {
            case 'ended':
                return 'No Previous Calls';
            case 'upcoming':
                return 'No Upcoming Calls';
            case 'recordings':
                return 'No Recordings';
            default:
                return '';
        }
    };

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const callData = await Promise.all(
                    callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
                );

                const recordings = callData
                    .filter((call) => call.recordings.length > 0)
                    .flatMap((call) => call.recordings);

                setRecordings(recordings);
            } catch (e) {
                toast({ title: 'Try again later' });
            }
        };

        if (type === 'recordings') {
            fetchRecordings();
        }
    }, [type, callRecordings, toast]);

    if (isLoading) return <Loader />;

    let calls = getCalls() ?? [];
    const noCallsMessage = getNoCallsMessage();

    if (isHomepage && calls.length > 3) {
        calls = calls.slice(0, 6);
    }

    const items = calls.map((meeting: Call | CallRecording) => ({
        title:
            (meeting as Call).state?.custom?.description ||
            (meeting as CallRecording).filename?.substring(0, 20) ||
            'Personal Meeting',
        description:
            (meeting as Call).state?.startsAt?.toLocaleString() ||
            (meeting as CallRecording).start_time?.toLocaleString(),
        link:
            type === 'recordings'
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}/?interviewType=${(meeting as Call).state?.custom?.interviewType}`,
    }));

    return (
        <div className='px-4 md:px-8 overflow-hidden'>
            {calls.length > 0 ? (
                <HoverEffect items={items} className="" type={type}/>
            ) : (
                <HoverEffect items={[
                    {
                        title: noCallsMessage,
                        description: "",
                        link: type === 'ended' ? '/home/previous' : type === 'upcoming' ? '/home/upcoming' : '/home/recordings'
                    }
                ]} />
            )}
        </div>
    );
};

export default CallList;
