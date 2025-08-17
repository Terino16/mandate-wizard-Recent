"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BottomChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onNewChat: () => void;
  isLoading: boolean;
  credits?: number;
}

export function BottomChatInput({
  input,
  onInputChange,
  onSubmit,
  onNewChat,
  isLoading,
  credits,
}: BottomChatInputProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-3xl mx-auto p-4 z-[10]">
      <form
        onSubmit={onSubmit}
        className="w-full bg-white dark:bg-black rounded-full"
      >
        <div className="flex items-center gap-2 rounded-xl p-3 shadow-sm bg-transparent border-[0.5px] border-gray-200 dark:border-gray-800">
          {/* New Chat Button */}
          <Button
            type="button"
            onClick={onNewChat}
            className="rounded-xl bg-gray-100 dark:bg-gray-100 text-gray-900 dark:text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 transform hover:scale-[1.02] transition-all duration-200 px-3"
            title="Start New Chat"
          >
            <Plus className="h-4 w-4" />
          </Button>
          
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
            className="rounded-xl bg-[#9747FF] dark:bg-[#9747FF] transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || (credits !== undefined && credits <= 0)}
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
  );
}
