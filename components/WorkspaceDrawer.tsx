"use client";

import React from "react";
import { Drawer } from "vaul";
import WorkspacePanel from "./WorkspacePanel";
import { PanelLeft } from "lucide-react";

const WorkspaceDrawer = () => {
  return (
    <Drawer.Root shouldScaleBackground>
      <Drawer.Trigger asChild>
        <button className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 text-white transition hover:bg-[#4c535b]">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <PanelLeft size={16} />
            Workspace
          </span>
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-gray-900 text-xl text-neutral-300 flex flex-col rounded-t-[10px] h-full mt-24 max-h-[96%] fixed bottom-0 left-0 right-0 z-40">
          <div className="p-4 bg-gradient-to-b from-transparent to-black rounded-t-[10px] flex-1 overflow-y-auto custom-scrollbar">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-6" />
            <WorkspacePanel />
          </div>
          <Drawer.Close>
            <div className="p-2 text-sm font-semibold text-center">
              Close
            </div>
          </Drawer.Close>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default WorkspaceDrawer;

