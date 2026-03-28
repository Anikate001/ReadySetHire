"use client";

import Image from "next/image";
import HomeCard from "./HomeCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "./ui/textarea";
import ReactDatePicker from 'react-datepicker';
import { Input } from "./ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SelectForm } from "./InterviewTypeSelect";



const MeetingTypeList = () => {

    const { toast } = useToast();

    const router = useRouter();
    const [meetingState, setMeetingState] = useState<'isInterviewMeeting' | 'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();

    const { user } = useUser();
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    });

    const [callDetails, setCallDetails] = useState<Call>();

    const createMeeting = async (type?: string) => {
        if (!client || !user) return;
        try {
            if (!values.dateTime) {
                toast({
                    title: 'Please select a date and time!'
                });
                return;
            }

            const id = crypto.randomUUID();
            const call = client.call('default', id);

            if (!call) throw new Error('failed to create call');

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || "Instant Meeting";

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description
                    }
                }
            });

            setCallDetails(call);

            if (type?.length && type.length > 0) {
                router.push(`/meeting/${call.id}/?interviewType=${type}`);
            } else if (!values.description) {
                router.push(`/meeting/${call.id}`);
            }

            toast({
                title: 'Meeting created!'
            })

        } catch (error) {
            console.log('error occured while creating a new meeting in meetingtypelist.tsx' + error);
            toast({
                title: 'Failed to create meeting'
            })
        }
    }

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

    return (
        <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
            <HomeCard
                img={'/icons/add-meeting.svg'}
                title='New Meeting'
                description='Start an instant meeting'
                handleClick={() => setMeetingState('isInstantMeeting')}
                className="bg-orange-1"
            />
            <HomeCard
                img={'/icons/schedule.svg'}
                title='Schedule Meeting'
                description='Plan your meeting'
                handleClick={() => setMeetingState('isScheduleMeeting')}
                className="bg-blue-1"
            />
            <HomeCard
                img={'/icons/recordings.svg'}
                title='View Recordings'
                description='Check Your recordings'
                handleClick={() => router.push('/recordings')}
                className="bg-purple-1"
            />
            <HomeCard
                img={'/icons/join-meeting.svg'}
                title='Join Meeting'
                description='Via invitation link'
                handleClick={() => setMeetingState('isJoiningMeeting')}
                className="bg-yellow-1"
            />
            <HomeCard
                img={'/icons/join-meeting.svg'}
                title='Practice Interview'
                description='With your peers'
                handleClick={() => setMeetingState('isInterviewMeeting')}
                className="bg-green-1"
            />

            {!callDetails ? (
                <MeetingModal
                    isOpen={meetingState === 'isScheduleMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title='Schedule an upcoming meeting'
                    handleClick={() => {
                        if (!values.description) {
                            toast({ title: "Please provide a valid description for the meeting!" });
                            return;
                        }
                        createMeeting();
                    }}
                >
                    <div className="flex flex-col gap-2.5">
                        <label className="text-base text-normal leading-[22px] text-sky-2">
                            Add a description
                        </label>
                        <Textarea
                            className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0 "
                            onChange={(e) => {
                                setValues({ ...values, description: e.target.value });
                            }}
                        />
                        <div className="flex w-full flex-col gap-2.5">
                            <label className="text-base text-normal leading-[22px] text-sky-2">
                                Select date and time
                            </label>
                            <ReactDatePicker
                                selected={values.dateTime}
                                onChange={(date) => setValues({ ...values, dateTime: date! })}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                                className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                            />
                        </div>
                    </div>
                </MeetingModal>
            ) : (
                <MeetingModal
                    isOpen={meetingState === 'isScheduleMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title='Meeting Created!'
                    className='text-center'
                    handleClick={() => {
                        navigator.clipboard.writeText(meetingLink);
                        toast({
                            title: 'Link copied!'
                        });
                    }}
                    buttonText='Copy meeting link'
                    buttonIcon="/icons/copy.svg"
                    image="/icons/checked.svg"
                />
            )}

            <MeetingModal
                isOpen={meetingState === 'isInstantMeeting'}
                onClose={() => setMeetingState(undefined)}
                title='Start an Instant Meeting'
                className='text-center'
                buttonText='Start Meeting'
                handleClick={createMeeting}
            />

            <MeetingModal
                isOpen={meetingState === 'isJoiningMeeting'}
                onClose={() => setMeetingState(undefined)}
                title='Paste the link here'
                className='text-center'
                buttonText='Join Meeting'
                handleClick={() => router.push(values.link)}
            >
                <Input
                    onChange={(e) => setValues({ ...values, link: e.target.value })}
                    placeholder="Meeting link"
                    className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </MeetingModal>


            <MeetingModal
                isOpen={meetingState === 'isInterviewMeeting'}
                onClose={() => setMeetingState(undefined)}
                title='Give Mock Interviews'
                className='text-center'
                buttonText='Join Meeting'
                handleClick={() => { }}
            >
                <SelectForm createMeeting={createMeeting} />

            </MeetingModal>

        </section>
    )
}

export default MeetingTypeList