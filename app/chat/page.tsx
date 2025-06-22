"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import Image from "next/image";
import style from "@/styles/markdown-styles.module.css"
import ReactMarkdown from "react-markdown";

const EXAMPLE_PROMPTS = [
  "Show me active the most active mandates in [genre] right now.",
  "Which studios are currently looking for projects similar to [brief description/logline]?",
  "What emerging trends are appearing in TV mandates this month?",
  "Find me contacts for recent [genre] film mandates",
];

// Helper function to get formatted current date
const getCurrentDate = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  };
  return now.toLocaleDateString('en-US', options);
};

// Loading stages component with tick progression
const LoadingStages = ({ isVisible }: { isVisible: boolean }) => {
  const [currentStage, setCurrentStage] = useState(-1); // Start with -1 so first stage appears at 0
  const stages = ['Searching', 'Analysing', 'Finishing'];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStage(-1);
      return;
    }

    // Start immediately with first stage
    setCurrentStage(0);

    const interval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev < stages.length - 1) {
          return prev + 1;
        }
        return prev; // Stay on "Finishing" if it takes longer
      });
    }, 4000); // Changed to 3 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="space-y-2 py-4">
      {stages.map((stage, index) => {
        // Determine visibility and icon state
        // eslint-disable-next-line
        const isCurrentStage = index === currentStage;
        const isCompletedStage = index < currentStage;
        const isVisibleStage = index <= currentStage;

        return (
          <div
            key={stage}
            className={`flex items-center gap-2 transition-all duration-300 ${
              isVisibleStage ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              visibility: isVisibleStage ? 'visible' : 'hidden'
            }}
          >
            {isCompletedStage ? (
              <Check className="h-4 w-4 text-purple-500" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
            )}
            <span className={`text-sm ${
              isCompletedStage 
                ? 'text-white dark:text-white' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {stage}...
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function Chat() {
  // eslint-disable-next-line
  const { messages, input, handleInputChange, handleSubmit, setInput, isLoading } =
    useChat({
      maxSteps: 3,
    });

  const [isChatStarted, setIsChatStarted] = useState(false);
  const [showLoadingStages, setShowLoadingStages] = useState(false);
  // eslint-disable-next-line
  const [isStreaming, setIsStreaming] = useState(false);

  // Track when response starts streaming
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && lastMessage.content.length > 0) {
        setIsStreaming(true);
        setShowLoadingStages(false);
      }
    }
  }, [messages]);

  // Modified submit handler to prepend date and show loading stages
  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Get current date and format the message
    const currentDate = getCurrentDate();
    const formattedMessage = `Date- ${currentDate} User Query - ${input}`;
    
    // Show loading stages
    setShowLoadingStages(true);
    setIsStreaming(false);
    
    // Store original input
    // eslint-disable-next-line
    const originalInput = input;
    
    // Temporarily update the input state with formatted message
    setInput(formattedMessage);
    
    // Submit the form with formatted message
    setTimeout(() => {
      handleSubmit(e);
      setInput(''); // Clear input after submission
      setIsChatStarted(true);
    }, 0);
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
        {/* Content area - conditionally shown based on chat state */}
        {!isChatStarted ? (
          <div className="w-full flex flex-col items-center justify-center">
            {/* Purple Orb */}
            <div className="relative w-24 h-24 mb-6 mt-20">
              <Image
                src="/AIAssistent.png"
                alt="Logo"
                width={96}
                height={96}
                className="rounded-full animate-slow-spin"
              />
            </div>

            {/* Greeting */}
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

            {/* Input section */}
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
          // Messages area
          <div className="w-full flex-1 overflow-hidden pt-4 z-[10]">
            <div className="h-10"></div>
            <ScrollArea className="h-[calc(100vh-120px)] w-full pr-4">
              <div className="space-y-6 pb-20">
                {messages.map((m) => (
                  <div key={m.id} className="space-y-1">
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
                          />
                          AI
                        </span>
                      )}
                    </div>
                    <div className="text-base whitespace-pre-wrap">
                      {m.content.length > 0 ? (
                        <div className={style.reactMarkDown}>
                          <ReactMarkdown>
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <span className="italic text-sm text-gray-500">
                          {"calling tool: " + m?.toolInvocations?.[0].toolName}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Loading stages - shown after user message but before AI response */}
                {showLoadingStages && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground uppercase font-semibold">
                      <span className="flex items-center gap-2">
                        <Image
                          src="/AIAssistent.png"
                          alt="Logo"
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
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
                  className="w-fit text-left text-[#130261] h-auto whitespace-normal py-4 px-3 rounded-2xl
                    bg-white dark:bg-[#0B0E11]/60 dark:text-white font-normal
                    border-4 border-white dark:border-gray-800 dark:border-[1px]
                    shadow-lg shadow-[#EBEEFE] dark:shadow-[#14122C] dark:shadow-sm
                    hover:bg-gray-100/80 dark:hover:bg-zinc-900/80 
                    duration-200"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {`"${prompt}"`}
                </Button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Fixed bottom input when chat is started */}
      {isChatStarted && (
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-3xl mx-auto p-4 z-[10]">
          <form onSubmit={handleChatSubmit} className="w-full bg-white dark:bg-black rounded-full">
            <div className="flex items-center gap-2 rounded-xl p-3 shadow-sm bg-transparent border-[0.5px] border-gray-200 dark:border-gray-800">
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
      )}
    </div>
  );
}
