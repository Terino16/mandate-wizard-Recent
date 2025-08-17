"use client";

import React from "react";
import Image from "next/image";
import { ChatInput } from "./ChatInput";

interface GreetingProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onPromptClick: (prompt: string) => void;
  credits?: number;
}

export function Greeting({ 
  input, 
  onInputChange, 
  onSubmit, 
  onPromptClick,
  credits
}: GreetingProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-6 mt-40">
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
      
      <ChatInput
        input={input}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        onPromptClick={onPromptClick}
        isChatStarted={false}
        credits={credits}
      />
    </div>
  );
}
