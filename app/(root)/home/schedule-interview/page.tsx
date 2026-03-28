"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const ScheduleInterview = () => {
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useUser();
    const client = useStreamVideoClient();

    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: '',
        type: 'dsa'
    });

    const [callDetails, setCallDetails] = useState<Call>();

    const createMeeting = async () => {
        if (!client ||!user) return;
        try {
            // Check if the selected date and time are in the future
            const now = new Date();
            if (values.dateTime <= now) {
                toast({
                    title: 'Invalid Date and Time',
                    description: 'You cannot schedule a meeting in the past. Please select a future date and time.'
                });
                return;
            }
    
            // Check if a description has been provided
            if (!values.description.trim()) {
                toast({
                    title: 'Description Required',
                    description: 'Please add a description for your meeting.'
                });
                return;
            }
    
            const id = crypto.randomUUID();
            const call = client.call('default', id);
    
            if (!call) throw new Error('failed to create call');
    
            const startsAt = values.dateTime.toISOString();
            const description = values.description;
    
            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description, interviewType: values.type
                    }
                }
            });
    
            setCallDetails(call);
            const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}/?interviewType=${values.type}`;
    
            setValues({...values, link: meetingLink });
    
            toast({
                title: 'Meeting created!',
                description: 'The meeting link has been generated and copied to your clipboard.',
            });
    
            navigator.clipboard.writeText(meetingLink);

            router.push('/home');
    
        } catch (error) {
            console.error('Error creating meeting:', error);
            toast({
                title: 'Failed to create meeting',
                description: 'An error occurred while creating the meeting. Please try again.',
            });
        }
    };
    

    return (
        <section className="overflow-hidden">
            <div className="h-screen w-full relative flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                <div className="absolute inset-0 flex items-center justify-center bg-black opacity-50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="relative grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl mx-auto px-4">
                    <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left">
                        <h1 className="text-2xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                            Schedule Interview
                        </h1>
                        <p className="mt-8 text-lg text-gray-300 md:pr-36">
                            Practice with real-time mock interviews and get personalized feedback to improve your skills.
                        </p>
                    </div>
                    <div className="flex items-center justify-center max-sm:pt-12">
                        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                            <div className="flex flex-col gap-4">
                                <label className="text-base leading-[22px] text-gray-300">
                                    Select Interview Type
                                </label>
                                <Select
                                    value={values.type}
                                    onValueChange={(value) => setValues({ ...values, type: value })}
                                >
                                    <SelectTrigger className="bg-gray-700 text-gray-300">
                                        <SelectValue placeholder="Select interview type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 text-gray-300">
                                        <SelectItem value="dsa">DSA</SelectItem>
                                        <SelectItem value="webdev">Web Development</SelectItem>
                                        <SelectItem value="consulting">Consulting</SelectItem>
                                    </SelectContent>
                                </Select>
                                <label className="text-base leading-[22px] text-gray-300">
                                    Add a Description
                                </label>
                                <Textarea
                                    className="border-none bg-gray-700 text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    onChange={(e) => setValues({ ...values, description: e.target.value })}
                                    placeholder="Enter meeting description"
                                />
                                <label className="text-base leading-[22px] text-gray-300">
                                    Select Date and Time
                                </label>
                                <ReactDatePicker
                                    selected={values.dateTime}
                                    onChange={(date) => setValues({ ...values, dateTime: date! })}
                                    showTimeSelect
                                    timeFormat="h:mm aa"
                                    timeIntervals={15}
                                    timeCaption="time"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    className="w-full rounded bg-gray-700 text-gray-300 p-2 focus:outline-none"
                                />
                                <button
                                    onClick={createMeeting}
                                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Schedule Interview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ScheduleInterview;
