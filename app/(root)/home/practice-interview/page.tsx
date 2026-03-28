"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast";

type InterviewType = 'dsa' | 'webdev' | 'consulting';

const PracticeInterview = () => {
    const params = useSearchParams();
    const type = params.get('type') as InterviewType | null;
    const { user } = useUser();
    const client = useStreamVideoClient();
    const { toast } = useToast();
    const router = useRouter();
    const [callDetails, setCallDetails] = useState<Call | null>(null);
    const [isLoading, setIsLoading] = useState(true); 
    useEffect(() => {
        if (type) {
            createMeeting(type).finally(() => setIsLoading(false)); 
        } else {
            toast({
                title: 'Invalid interview type'
            });
            setIsLoading(false); 
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    const createMeeting = async (interviewType: InterviewType) => {
        if (!client ||!user) return;
        try {
            const id = crypto.randomUUID();
            const call = client.call('default', id);

            if (!call) throw new Error('failed to create call');

            await call.getOrCreate({
                data: {
                    starts_at: new Date().toISOString(),
                    custom: {
                        description: `Practice Interview - ${interviewType}`
                    }
                }
            });

            setCallDetails(call);

            router.push(`/meeting/${call.id}/?interviewType=${interviewType}`);

            toast({
                title: 'Meeting created!',
                description: `A ${interviewType} interview meeting has been created.`,
            });

        } catch (error) {
            console.error('Error creating meeting:', error);
            toast({
                title: 'Failed to create meeting',
                description: 'An error occurred while creating the meeting.',
            });
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black py-6 flex flex-col justify-center sm:py-12">
          <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative px-4 py-10 bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg sm:rounded-3xl sm:p-20">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  {/* <LoadingSpinner /> */}
                </div>
              ) : (
                <>
                  {!callDetails && (
                    <p className="text-lg text-gray-800">
                      Creating your {type} practice interview...
                    </p>
                  )}
                  {callDetails && (
                    <div className="animate-fade-in">
                      {/* Add transition animation */}
                      <p className="text-lg text-white">
                        Your {type} practice interview is ready!
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      );
}

export default PracticeInterview;

