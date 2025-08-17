"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onPromptClick: (prompt: string) => void;
  isChatStarted: boolean;
  credits?: number;
}

const EXAMPLE_PROMPTS = [
  "Show me active the most active mandates in [genre] right now.",
  "Which studios are currently looking for projects similar to [brief description/logline]?",
  "What emerging trends are appearing in TV mandates this month?",
  "Find me contacts for recent [genre] film mandates",
];

export function ChatInput({ 
  input, 
  onInputChange, 
  onSubmit, 
  onPromptClick, 
  isChatStarted,
  credits
}: ChatInputProps) {
  return (
    <>
      {/* Main Chat Input */}
      <div className="w-full max-w-3xl mt-6">
        <form onSubmit={onSubmit} className="w-full">
          <div className="flex items-center rounded-xl p-2 shadow-sm bg-transparent border-[0.5px] border-zinc-200 dark:border-zinc-700">
            <Input
              className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-transparent"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e && e.target && onInputChange) {
                  onInputChange(e.target.value);
                }
              }}
              placeholder={credits && credits <= 0 ? "No credits remaining. Please purchase more credits." : "Ask about mandates, trends, or pitching opportunities..."}
              disabled={credits !== undefined && credits <= 0}
            />
            <Button
              type="submit"
              className="rounded-xl bg-[#9747FF] dark:bg-[#9747FF] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={credits !== undefined && credits <= 0}
            >
              Send <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Example prompts */}
      {!isChatStarted && (
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
                  className="w-fit text-left text-[#130261] h-auto whitespace-normal py-4 px-3 rounded-2xl bg-white dark:bg-[#0B0E11]/60 dark:text-white font-normal border-4 border-white dark:border-gray-800 dark:border-[1px] shadow-lg shadow-[#EBEEFE] dark:shadow-[#14122C] dark:shadow-sm hover:bg-gray-100/80 dark:hover:bg-zinc-900/80 duration-200 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => onPromptClick(prompt)}
                  disabled={credits !== undefined && credits <= 0}
                >
                  {`"${prompt}"`}
                </Button>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
