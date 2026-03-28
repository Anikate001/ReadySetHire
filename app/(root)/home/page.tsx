"use client";

import { SVGProps, useState } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import CallList from "@/components/CallList";
import { FlipWords } from "@/components/ui/flip-words";

export default function Page() {
  const words = ['DSA', "Frontend", 'Consulting'];
  const router = useRouter();
  const { toast } = useToast();

  const [meetingLink, setMeetingLink] = useState('');

  const joinMeeting = () => {
    if (!meetingLink.trim()) {
      toast({
        title: 'Invalid Link',
        description: 'Please enter a valid meeting link.',
      });
      return;
    }

    // Example parsing logic - adjust according to the actual structure of your meetingLink
    // Assuming the meetingLink has a structure like https://example.com/meeting/8f10c0eb-eabf-492d-87e9-fad2b6170157/?interviewType=webdev
    // Extract the ID and interview type from the meetingLink
    const idMatch = meetingLink.match(/\/meeting\/([^\/]+)\//); // Adjust regex based on actual URL structure
    const interviewTypeMatch = meetingLink.match(/\?interviewType=([^&]+)/);

    if (!idMatch || !interviewTypeMatch) {
      toast({
        title: 'Invalid Link Format',
        description: 'The meeting link does not contain the required information.',
      });
      return;
    }

    const id = idMatch[1];
    const interviewType = interviewTypeMatch[1];

    // Construct the new meeting link
    const newMeetingLink = `/meeting/${id}?interviewType=${interviewType}`;

    // Navigate to the new meeting link within the app
    router.push(newMeetingLink);
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-900 text-white w-full overflow-hidden">
      <section className="overflow-hidden">
        <div className="h-screen w-full relative flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
          <div className="absolute inset-0 flex items-center justify-center bg-black opacity-50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="relative grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl lg:7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                Ace Your Next<br /><FlipWords words={words} /> Interview
              </h1>
              <p className="mt-8 text-lg text-gray-300 md:pr-36">
                Practice with real-time mock interviews and get personalized feedback to improve your skills.
              </p>
            </div>
            <div className="flex items-center justify-center max-lg:pt-12">
              <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex flex-col gap-4">
                  <label className="text-base leading-[22px] text-gray-300">
                    Paste Meeting Invite Link
                  </label>
                  <input
                    type="text"
                    className="w-full rounded bg-gray-700 text-gray-300 p-2 focus:outline-none"
                    placeholder="Enter meeting link"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                  <button
                    onClick={joinMeeting}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Join Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-gray-900 overflow-hidden">
        <div className="py-24 px-4 md:px-12 bg-gray-800 text-neutral-300">
          <div className="w-full py-6">
            <h2 className="text-4xl font-bold mb-4">Upcoming Mock Interviews</h2>
            <CallList type="upcoming" isHomepage={true} />
          </div>
          <div className="mt-8">
            <h2 className="text-4xl font-bold mb-4">Recent Interviews</h2>
            <CallList type="ended" isHomepage={true} />
          </div>
          <div className="mt-8">
            <h2 className="text-4xl font-bold mb-4">Recorded Interviews</h2>
            <CallList type="recordings" isHomepage={true} />
          </div>
        </div>
      </section>
    </main>
  );
}

function FileQuestionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 17h.01" />
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
      <path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" />
    </svg>
  );
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function VideoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 7l-7 5 7 5V7z" />
      <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
    </svg>
  );
}