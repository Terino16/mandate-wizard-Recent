"use client";

import React from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { AiLoadAnim } from "./AiLoadAnim";

interface SearchResult {
  title: string;
  description: string;
  link: string;
}

interface ChatMessagesProps {
  messages: any[];
  isLoading: boolean;
  isSearching: boolean;
  searchResults: SearchResult[];
  showRelatedResources: boolean;
  showLoadingStages: boolean;
  onShowRelatedResources: () => void;
}

export function ChatMessages({
  messages,
  isLoading,
  isSearching,
  searchResults,
  showRelatedResources,
  showLoadingStages,
  onShowRelatedResources,
}: ChatMessagesProps) {
  return (
    <div className="w-full flex-1 overflow-hidden pt-8 z-[10]">
      <div className="h-10"></div>
      <ScrollArea className="h-[calc(100vh-120px)] w-full pr-4">
        <div className="space-y-6 pb-20">
          {messages.map((m, index) => (
            <ChatMessage
              key={m.id}
              message={m}
              index={index}
              messagesLength={messages.length}
              isLoading={isLoading}
              isSearching={isSearching}
              searchResults={searchResults}
              showRelatedResources={showRelatedResources}
              onShowRelatedResources={onShowRelatedResources}
            />
          ))}

          {showLoadingStages && (
            <div className="space-y-1 animate-in slide-in-from-bottom-2 duration-300">
              <div className="text-sm text-muted-foreground uppercase font-semibold">
                <span className="flex items-center gap-2">
                  <Image
                    src="/AIAssistent.png"
                    alt="Logo"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />{" "}
                  AI
                </span>
              </div>
              <AiLoadAnim />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
