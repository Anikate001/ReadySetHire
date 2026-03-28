import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, NotebookPen, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Loader from './Loader';
import DSARecommendedQuestions from './DSARecommendedQuestions';
import WebdevQuestions from './WebdevQuestions';
import ConsultingQuestions from './ConsultingQuestions';
import { QuestionsDrawer } from './QuestionsDrawer';
import WorkspacePanel from './WorkspacePanel';
import WorkspaceDrawer from './WorkspaceDrawer';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';
type InterviewType = 'dsa' | 'webdev' | 'consulting';

const CallLayout = ({ layout }: { layout: CallLayoutType }) => {
  switch (layout) {
    case 'grid':
      return <PaginatedGridLayout />;
    case 'speaker-right':
      return <SpeakerLayout participantsBarPosition="left" />;
    default:
      return <SpeakerLayout participantsBarPosition="right" />;
  }
};

const MeetingRoom = ({ type }: { type?: InterviewType }) => {
  const router = useRouter();
  const [showQuestions, setShowQuestions] = useState(false);
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(true);
  const { useCallCallingState } = useCallStateHooks();
  const isCalling = useCallCallingState();

  if (isCalling !== CallingState.JOINED) return <Loader />;

  return (
    <div className="flex gap-2 h-screen overflow-hidden">
      {type && showQuestions && (
        <div className="flex flex-col h-full w-full gap-4 max-w-xs md:max-w-sm bg-gray-800 text-white p-5 rounded-2xl m-5 max-sm:hidden">
          <div className="font-bold text-xl">
            {type === 'dsa' ? 'DSA' : type === 'webdev' ? 'Web Development' : 'Consulting'} Interview
          </div>
          {type === 'dsa' ? <DSARecommendedQuestions type={type} /> : type === 'webdev' ? <WebdevQuestions /> : <ConsultingQuestions />}
        </div>
      )}

      <section className="relative flex-1 h-full overflow-hidden pt-4 text-white">
        <div className="relative flex justify-center h-full">
          <div className="flex max-w-[1000px] w-full items-center mx-5">
            <CallLayout layout={layout} />
          </div>
          {showParticipants && (
            <div className="h-full w-64 ml-2 bg-gray-900 p-4 rounded-2xl">
              <CallParticipantsList onClose={() => setShowParticipants(false)} />
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 w-full flex items-center justify-center gap-5 bg-gray-900 bg-opacity-50 backdrop-blur-md flex-wrap">
          {type && (
            <>
              <button onClick={() => setShowQuestions((prev) => !prev)} className="max-sm:hidden">
                <div className="cursor-pointer rounded-2xl bg-[#19232d] hover:bg-[#4c535b] px-4 py-2 transition-all">
                  <div className="text-white">{!showQuestions ? 'View Recommended Questions' : 'Hide Recommended Questions'}</div>
                </div>
              </button>
              <span className="hidden max-sm:block">
                <QuestionsDrawer type={type} />
              </span>
            </>
          )}

          <button onClick={() => setShowWorkspace((prev) => !prev)} className="max-lg:hidden">
            <div className="cursor-pointer rounded-2xl bg-[#19232d] hover:bg-[#4c535b] px-4 py-2 transition-all flex items-center gap-2">
              <NotebookPen size={18} className="text-white" />
              <span className="text-white text-sm">{showWorkspace ? 'Hide Workspace' : 'Show Workspace'}</span>
            </div>
          </button>
          <span className="hidden max-lg:block">
            <WorkspaceDrawer />
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] hover:bg-[#4c535b] px-4 py-2 transition-all">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
              {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className="cursor-pointer"
                  onClick={() => setLayout(item.toLowerCase().replace('-', '') as CallLayoutType)}
                >
                  {item}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="border-dark-1" />
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="max-sm:hidden">
            <CallStatsButton />
          </span>

          <button onClick={() => setShowParticipants((prev) => !prev)} className="max-sm:hidden">
            <div className="cursor-pointer rounded-2xl bg-[#19232d] hover:bg-[#4c535b] px-4 py-2 transition-all">
              <Users size={20} className="text-white" />
            </div>
          </button>

          <CallControls onLeave={() => router.push('/')} />
        </div>
      </section>

      {showWorkspace && (
        <div className="flex h-full w-full max-w-md bg-transparent p-5 text-white max-lg:hidden">
          <WorkspacePanel className="w-full" />
        </div>
      )}
    </div>
  );
};

export default MeetingRoom;
