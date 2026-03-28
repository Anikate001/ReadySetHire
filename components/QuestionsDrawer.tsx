"use client";

import { Drawer } from "vaul";
import DSARecommendedQuestions from "./DSARecommendedQuestions";
import WebdevQuestions from "./WebdevQuestions";
import ConsultingQuestions from "./ConsultingQuestions";

type interviewType = 'dsa' | 'webdev' | 'consulting';

export function QuestionsDrawer({ type }: { type: interviewType }) {

    return (
        <Drawer.Root shouldScaleBackground>
            <Drawer.Trigger asChild>
                <button>
                    <div className='cursor-pointer rounded-2xl bg-[#19232d] hover:bg-[#4c535b] px-4 py-2 transition-all'>
                        <div className='text-white'>
                            {type === 'dsa' ? ('Leetcode Questions') : ('AI Questions')}
                        </div>
                    </div>
                </button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="bg-gray-900 text-xl text-neutral-300 flex flex-col rounded-t-[10px] h-full mt-24 max-h-[96%] fixed bottom-0 left-0 right-0 z-40">
                    <div className="p-4 bg-gradient-to-b from-transparent to-black rounded-t-[10px] flex-1 overflow-y-auto custom-scrollbar">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                        <div className="flex flex-col items-center justify-center gap-4">
                            <Drawer.Title className="font-medium mb-4">
                                <div className='font-bold text-xl'>
                                    {type === 'dsa' ?
                                        (<span>DSA</span>)
                                        : type === 'webdev' ?
                                            (<span>Web Development</span>)
                                            : (<span>Consulting</span>)
                                    }
                                    &nbsp;Interview
                                </div>
                            </Drawer.Title>

                            <div className="w-full">
                                {type === 'dsa' ?
                                    (<DSARecommendedQuestions type={type} />)
                                    : type === 'webdev' ?
                                        (<WebdevQuestions />)
                                        : (<ConsultingQuestions />)
                                }
                            </div>
                        </div>
                    </div>
                    <Drawer.Close>
                        <div className="p-2">
                            Close
                        </div>
                    </Drawer.Close>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
