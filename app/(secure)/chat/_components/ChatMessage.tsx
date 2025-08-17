"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { SearchResultCard } from "@/components/general/SearchResultCard";
import style from "@/styles/markdown-styles.module.css";
import ReactMarkdown from "react-markdown";

interface SearchResult {
  title: string;
  description: string;
  link: string;
}

interface ChatMessageProps {
  message: {
    role: string;
    content: string;
  };
  index: number;
  messagesLength: number;
  isLoading: boolean;
  isSearching: boolean;
  searchResults: SearchResult[];
  showRelatedResources: boolean;
  onShowRelatedResources: () => void;
}

export function ChatMessage({
  message,
  index,
  messagesLength,
  isLoading,
  isSearching,
  searchResults,
  showRelatedResources,
  onShowRelatedResources,
}: ChatMessageProps) {
  let displayContent = message.content;
  if (message.role === "user") {
    const queryMatch = message.content.match(/User Query - ([\s\S]*)/);
    if (queryMatch && queryMatch[1]) {
      displayContent = queryMatch[1];
    }
  }

  const isLastAssistantMessage = message.role === "assistant" && index === messagesLength - 1;
  const shouldShowRelatedResourcesButton = isLastAssistantMessage && 
    !showRelatedResources && 
    !isLoading && 
    !isSearching && 
    searchResults.length > 0;

  return (
    <div className="space-y-1 animate-in slide-in-from-bottom-2 duration-300">
      <div className="text-sm text-muted-foreground uppercase font-semibold">
        {message.role === "user" ? (
          "You"
        ) : (
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
        )}
      </div>
      <div className="text-base whitespace-pre-wrap">
        {message.content.length > 0 ? (
          <div>
            <div className={style.reactMarkDown}>
              <ReactMarkdown>{displayContent}</ReactMarkdown>
            </div>

            {/* Show Related Resources Button */}
            {shouldShowRelatedResourcesButton && (
              <div className="mt-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                <Button
                  onClick={onShowRelatedResources}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Show Related Resources
                </Button>
              </div>
            )}

            {/* Show Related Resources */}
            {isLastAssistantMessage &&
              showRelatedResources &&
              searchResults.length > 0 && (
                <div className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Related Resources
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {searchResults.map((result, idx) => (
                      <div 
                        key={idx}
                        className="animate-in fade-in-50 slide-in-from-bottom-1 duration-300"
                        style={{ animationDelay: `${idx * 80}ms` }}
                      >
                        <SearchResultCard
                          title={result.title}
                          description={result.description}
                          link={result.link}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ) : (
          <div className="animate-in fade-in-50 duration-300">
            {isLoading ? <div>Loading...</div> : ""}
          </div>
        )}
      </div>
    </div>
  );
}
