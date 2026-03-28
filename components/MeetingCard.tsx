'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import { avatarImages } from '@/constants';
import { useToast } from './ui/use-toast';
import { Card, CardTitle, CardDescription } from '@/components/ui/card-hover-effect';

interface MeetingCardProps {
    title: string;
    date: string;
    icon: string;
    isPreviousMeeting?: boolean;
    buttonIcon1?: string;
    buttonText?: string;
    handleClick: () => void;
    link: string;
}

const MeetingCard = ({
    icon,
    title,
    date,
    isPreviousMeeting,
    buttonIcon1,
    handleClick,
    link,
    buttonText,
}: MeetingCardProps) => {
    const { toast } = useToast();

    return (
        <Card>
            <Image src={icon} alt="upcoming" width={28} height={28} />
            <CardTitle>{title}</CardTitle>
            <CardDescription>{date}</CardDescription>
            <div className="flex justify-between items-center mt-4">
                <div className="relative flex w-full max-sm:hidden">
                    {avatarImages.map((img, index) => (
                        <Image
                            key={index}
                            src={img}
                            alt="attendees"
                            width={40}
                            height={40}
                            className={`rounded-full absolute`}
                            style={{ top: 0, left: index * 28 }}
                        />
                    ))}
                    <div className="flex-center absolute left-[136px] size-10 rounded-full border-[5px] border-dark-3 bg-dark-4">
                        +5
                    </div>
                </div>
                {!isPreviousMeeting && (
                    <div className="flex gap-2">
                        <Button onClick={handleClick} className="rounded bg-blue-1 px-6">
                            {buttonIcon1 && (
                                <Image src={buttonIcon1} alt="feature" width={20} height={20} />
                            )}
                            &nbsp; {buttonText}
                        </Button>
                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(link);
                                toast({
                                    title: 'Link Copied',
                                });
                            }}
                            className="bg-dark-4 px-6"
                        >
                            <Image
                                src="/icons/copy.svg"
                                alt="feature"
                                width={20}
                                height={20}
                            />
                            &nbsp; Copy Link
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default MeetingCard;
