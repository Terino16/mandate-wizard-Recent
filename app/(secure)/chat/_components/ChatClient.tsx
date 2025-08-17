"use client";

import React, { useState, useEffect } from "react";
import { useAssistant } from "ai/react";
import { toast } from "sonner";
import { Greeting } from "./Greeting";
import { ChatMessages } from "./ChatMessages";
import { BottomChatInput } from "./BottomChatInput";

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

  // return now.toLocaleDateString("en-US", options);
};

export function ChatClient({ credits, onCreditsUpdate }: { credits: number | undefined; onCreditsUpdate?: (newCredits: number) => void }) {
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  
  const { messages, input, setInput, append, status, setMessages } =
    useAssistant({
      api: "/api/chat",
      threadId,
    });

  // Wrapper function to handle input changes for components that expect string values
  const handleInputChangeWrapper = (value: string) => {
    setInput(value);
  };

  const isLoading = status === "in_progress";

  const [isChatStarted, setIsChatStarted] = useState(false);
  const [showLoadingStages, setShowLoadingStages] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showRelatedResources, setShowRelatedResources] = useState(false);

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
    setShowRelatedResources(false);
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

  // Show warning when credits are low (only once)
  useEffect(() => {
    if (credits !== undefined && credits <= 5 && credits > 0) {
      toast.warning(`You only have ${credits} credits remaining. Consider purchasing more credits.`);
    }
  }, [credits]);

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

    // Check if user has credits
    if (credits === undefined || credits <= 0) {
      toast.error("You don't have enough credits to send a message. Please purchase more credits.");
      return;
    }

    setSearchResults([]);
    setShowLoadingStages(true);
    setIsStreaming(false);
    setIsChatStarted(true);
    setShowRelatedResources(false);

    const currentDate = getCurrentDate();
    const formattedMessage = `Date- ${currentDate} User Query - ${input}`;

    setInput("");

    try {
      await append({
        role: "user",
        content: formattedMessage,
      });
      
      // Update credits locally after successful message
      if (onCreditsUpdate && credits !== undefined) {
        onCreditsUpdate(credits - 1);
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Insufficient credits') {
        toast.error("You don't have enough credits to send a message. Please purchase more credits.");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
      // Reset the UI state
      setShowLoadingStages(false);
      setIsChatStarted(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    // Check if user has credits before allowing prompt click
    if (credits === undefined || credits <= 0) {
      toast.error("You don't have enough credits to send a message. Please purchase more credits.");
      return;
    }
    setInput(prompt);
  };

  const handleShowRelatedResources = () => {
    setShowRelatedResources(true);
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
          <Greeting
            input={input}
            onInputChange={handleInputChangeWrapper}
            onSubmit={handleChatSubmit}
            onPromptClick={handlePromptClick}
            credits={credits}
          />
        ) : (
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            isSearching={isSearching}
            searchResults={searchResults}
            showRelatedResources={showRelatedResources}
            showLoadingStages={showLoadingStages}
            onShowRelatedResources={handleShowRelatedResources}
          />
        )}
      </div>

      {/* Fixed bottom input with new chat button */}
      {isChatStarted && (
        <BottomChatInput
          input={input}
          onInputChange={handleInputChangeWrapper}
          onSubmit={handleChatSubmit}
          onNewChat={handleNewChat}
          isLoading={isLoading}
          credits={credits}
        />
      )}
    </div>
  );
}