"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Check, Search, Brain, Sparkles, Plus } from "lucide-react";
import { useAssistant } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import Image from "next/image";
import style from "@/styles/markdown-styles.module.css";
import ReactMarkdown from "react-markdown";
import { SearchResultCard } from "@/components/general/SearchResultCard";

const EXAMPLE_PROMPTS = [
  "Show me active the most active mandates in [genre] right now.",
  "Which studios are currently looking for projects similar to [brief description/logline]?",
  "What emerging trends are appearing in TV mandates this month?",
  "Find me contacts for recent [genre] film mandates",
];

interface SearchResult {
  title: string;
  description: string;
  link: string;
}

// Helper function to get formatted current date
const getCurrentDate = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  };
  return now.toLocaleDateString("en-US", options);
};

// Enhanced Loading Stages with consistent purple theme
const LoadingStages = ({ isVisible }: { isVisible: boolean }) => {
  const [currentStage, setCurrentStage] = useState(-1);
  const stages = [
    { name: "Searching", icon: Search, color: "text-purple-400" },
    { name: "Analysing", icon: Brain, color: "text-purple-500" },
    { name: "Finishing", icon: Sparkles, color: "text-purple-600" }
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStage(-1);
      return;
    }

    setCurrentStage(0);

    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="space-y-3 py-4">
      {stages.map((stage, index) => {
        const isCompletedStage = index < currentStage;
        const isActiveStage = index === currentStage;
        const isVisibleStage = index <= currentStage;
        const IconComponent = stage.icon;

        return (
          <div
            key={stage.name}
            className={`flex items-center gap-3 transition-all duration-400 transform ${
              isVisibleStage 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 translate-x-2"
            }`}
            style={{
              transitionDelay: `${index * 150}ms`,
            }}
          >
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
              isCompletedStage 
                ? "bg-purple-500 border-purple-500" 
                : isActiveStage 
                ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20" 
                : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/20"
            }`}>
              {isCompletedStage ? (
                <Check className="h-4 w-4 text-white animate-in zoom-in duration-200" />
              ) : isActiveStage ? (
                <IconComponent className="h-4 w-4 text-purple-500 animate-pulse" />
              ) : (
                <IconComponent className="h-4 w-4 text-gray-400" />
              )}
              
              {/* Smaller animated ring for active stage */}
              {isActiveStage && (
                <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-60" />
              )}
            </div>
            
            <div className="flex-1">
              <span className={`text-sm font-medium transition-colors duration-300 ${
                isCompletedStage
                  ? "text-purple-600 dark:text-purple-400"
                  : isActiveStage
                  ? "text-purple-500 dark:text-purple-300"
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {stage.name}...
              </span>
              
              {/* Smaller progress bar */}
              <div className="mt-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full transition-all duration-1000 ${
                    isCompletedStage 
                      ? "w-full bg-purple-500" 
                      : isActiveStage 
                      ? "w-2/3 bg-purple-400 animate-pulse" 
                      : "w-0 bg-gray-300"
                  }`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Skeleton component with purple theme
const MessageSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-purple-200 dark:bg-purple-800/40 rounded-full"></div>
        <div className="w-8 h-3 bg-purple-200 dark:bg-purple-800/40 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-3 bg-purple-100 dark:bg-purple-900/30 rounded animate-shimmer"></div>
        <div className="w-4/5 h-3 bg-purple-100 dark:bg-purple-900/30 rounded animate-shimmer"></div>
        <div className="w-3/4 h-3 bg-purple-100 dark:bg-purple-900/30 rounded animate-shimmer"></div>
        <div className="w-2/3 h-3 bg-purple-100 dark:bg-purple-900/30 rounded animate-shimmer"></div>
      </div>
    </div>
  );
};

// Smaller typing indicator with purple theme
const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm">Finding related resources...</span>
    </div>
  );
};

export default function Chat() {
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  
  const { messages, input, handleInputChange, setInput, append, status, setMessages } =
    useAssistant({
      api: "/api/chat",
      threadId,
    });

  const isLoading = status === "in_progress";

  const [isChatStarted, setIsChatStarted] = useState(false);
  const [showLoadingStages, setShowLoadingStages] = useState(false);
  // eslint-disable-next-line
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = async (responseText: string) => {
    try {
      setIsSearching(true);
      const response = await fetch("/api/link-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage: responseText }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.results && Array.isArray(data.results)) {
          setSearchResults(data.results.slice(0, 5));
        }
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Function to start a new chat
  const handleNewChat = () => {
    setThreadId(undefined);
    setMessages([]);
    setIsChatStarted(false);
    setShowLoadingStages(false);
    setIsStreaming(false);
    setSearchResults([]);
    setIsSearching(false);
    setInput("");
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        if (lastMessage.content.length > 0) {
          setIsStreaming(true);
          setShowLoadingStages(false);
        }

        if (lastMessage.content.length > 0 && !isLoading) {
          performSearch(lastMessage.content);
        }
      }
    }
  }, [messages, isLoading]);

  // Handle completion logic when status changes
  useEffect(() => {
    if (status === "awaiting_message" && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        // Handle completion logic here
        console.log("Assistant message completed");
      }
    }
  }, [status, messages]);

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;

    setSearchResults([]);
    setShowLoadingStages(true);
    setIsStreaming(false);
    setIsChatStarted(true);

    const currentDate = getCurrentDate();
    const formattedMessage = `Date- ${currentDate} User Query - ${input}`;

    setInput("");

    await append({
      role: "user",
      content: formattedMessage,
    });
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex relative flex-col items-center justify-between w-full min-h-screen px-4 bg-white dark:bg-black">
      {/* Background blur effects */}
      <div className="w-[100px] h-[100px] bg-purple-500 rounded-full absolute top-4 left-4 blur-[150px]" />
      <div className="w-[100px] h-[100px] md:w-[250px] md:h-[250px] bg-purple-500 rounded-full absolute -bottom-4 -left-4 blur-[200px]" />
      <div className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] bg-blue-700 rounded-full absolute -top-4 -right-4 blur-[200px]" />

      <div className="flex flex-col items-start w-full max-w-3xl flex-1 z-[10]">
        {/* Greeting UI */}
        {!isChatStarted ? (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-6 mt-20">
              <Image
                src="/AIAssistent.png"
                alt="Logo"
                width={96}
                height={96}
                className="rounded-full animate-slow-spin"
              />
            </div>
            <h1 className="text-4xl font-normal text-center mb-2 text-black dark:text-white">
              What market{" "}
              <span className="bg-gradient-to-r from-black via-purple-700 to-purple-500 dark:bg-gradient-to-r dark:from-white dark:via-purple-300 dark:to-purple-600 text-transparent bg-clip-text">
                intelligence
              </span>{" "}
              can I help
            </h1>
            <h2 className="text-4xl font-normal text-center mb-8">
              you uncover today?
            </h2>
            <div className="w-full max-w-3xl mt-6">
              <form onSubmit={handleChatSubmit} className="w-full">
                <div className="flex items-center rounded-xl p-2 shadow-sm bg-transparent border-[0.5px] border-zinc-200 dark:border-zinc-700">
                  <Input
                    className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-transparent"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about mandates, trends, or pitching opportunities..."
                  />
                  <Button
                    type="submit"
                    className="rounded-xl bg-[#9747FF] dark:bg-[#9747FF]"
                  >
                    Send <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full flex-1 overflow-hidden pt-4 z-[10]">
            <div className="h-10"></div>
            <ScrollArea className="h-[calc(100vh-120px)] w-full pr-4">
              <div className="space-y-6 pb-20">
                {messages.map((m, index) => {
                  let displayContent = m.content;
                  if (m.role === "user") {
                    const queryMatch = m.content.match(/User Query - ([\s\S]*)/);
                    if (queryMatch && queryMatch[1]) {
                      displayContent = queryMatch[1];
                    }
                  }

                  return (
                    <div key={m.id} className="space-y-1 animate-in slide-in-from-bottom-2 duration-300">
                      <div className="text-sm text-muted-foreground uppercase font-semibold">
                        {m.role === "user" ? (
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
                        {m.content.length > 0 ? (
                          <div>
                            <div className={style.reactMarkDown}>
                              <ReactMarkdown>{displayContent}</ReactMarkdown>
                            </div>

                            {m.role === "assistant" &&
                              index === messages.length - 1 &&
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

                            {m.role === "assistant" &&
                              index === messages.length - 1 &&
                              isSearching && (
                                <div className="mt-4 animate-in fade-in-50 duration-300">
                                  <TypingIndicator />
                                </div>
                              )}
                          </div>
                        ) : (
                          <div className="animate-in fade-in-50 duration-300">
                            {status === "in_progress" ? <MessageSkeleton /> : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

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
                    <LoadingStages isVisible={showLoadingStages} />
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Example prompts */}
      {isChatStarted == false && (
        <div className="hidden mt-4 md:flex flex-col items-center gap-2 mb-12">
          {EXAMPLE_PROMPTS.reduce<string[][]>((rows, prompt, index) => {
            if (index % 2 === 0) {
              rows.push([prompt]);
            } else {
              rows[rows.length - 1].push(prompt);
            }
            return rows;
          }, []).map((pair, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 justify-center">
              {pair.map((prompt, i) => (
                <Button
                  key={i}
                  className="w-fit text-left text-[#130261] h-auto whitespace-normal py-4 px-3 rounded-2xl bg-white dark:bg-[#0B0E11]/60 dark:text-white font-normal border-4 border-white dark:border-gray-800 dark:border-[1px] shadow-lg shadow-[#EBEEFE] dark:shadow-[#14122C] dark:shadow-sm hover:bg-gray-100/80 dark:hover:bg-zinc-900/80 duration-200 transform hover:scale-[1.02] transition-all"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {`"${prompt}"`}
                </Button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Fixed bottom input with new chat button */}
      {isChatStarted && (
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-3xl mx-auto p-4 z-[10]">
          <form
            onSubmit={handleChatSubmit}
            className="w-full bg-white dark:bg-black rounded-full"
          >
            <div className="flex items-center gap-2 rounded-xl p-3 shadow-sm bg-transparent border-[0.5px] border-gray-200 dark:border-gray-800">
              {/* New Chat Button */}
              <Button
                type="button"
                onClick={handleNewChat}
                className="rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transform hover:scale-[1.02] transition-all duration-200 px-3"
                title="Start New Chat"
              >
                <Plus className="h-4 w-4" />
              </Button>
              
              <Input
                className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-transparent"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about mandates, trends, or pitching opportunities..."
              />
              <Button
                type="submit"
                className="rounded-xl bg-[#9747FF] dark:bg-[#9747FF] transform hover:scale-[1.02] transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Send <ArrowRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
