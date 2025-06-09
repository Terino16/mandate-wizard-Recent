"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import Image from "next/image";
import style from "@/styles/markdown-styles.module.css"
import ReactMarkdown from "react-markdown";


const EXAMPLE_PROMPTS = [
  "Show me active the most active mandates in [genre] right now.",
  "Which studios are currently looking for projects similar to [brief description/logline]?",
  "What emerging trends are appearing in TV mandates this month?",
  "Find me contacts for recent [genre] film mandates",
];


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({
      maxSteps: 3,
    });

  const [isChatStarted, setIsChatStarted] = useState(false);

  // Start chat when first message is submitted
  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
    setIsChatStarted(true);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    // Optionally, trigger submit automatically
    // const fakeEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
    // handleSubmit(fakeEvent);
  };

  return (
    <div className="flex relative flex-col items-center justify-between w-full min-h-screen  px-4 bg-white dark:bg-black ">

      <div className="w-[100px] h-[100px] bg-purple-500 rounded-full absolute top-4 left-4 blur-[150px]" />

      <div className="w-[100px] h-[100px] md:w-[250px] md:h-[250px] bg-purple-500 rounded-full absolute -bottom-4 -left-4 blur-[200px]" />
      <div className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] bg-blue-700 rounded-full absolute -top-4 -right-4 blur-[200px]" />

      <div className="flex flex-col items-start w-full max-w-3xl flex-1 z-[10]   ">
        {/* Content area - conditionally shown based on chat state */}
        {!isChatStarted ? (
          <div className=" w-full flex flex-col items-center justify-center">
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
            <h1 className="text-4xl font-normal text-center mb-2 text-black dark:text-white   ">
              What market{" "}
              <span className="bg-gradient-to-r from-black via-purple-700 to-purple-500 dark:bg-gradient-to-r dark:from-white dark:via-purple-300 dark:to-purple-600 text-transparent bg-clip-text">
                intelligence
              </span>{" "}
              can I help
            </h1>
            <h2 className="text-4xl font-normal text-center mb-8">
              you uncover today?
            </h2>

            {/* Input section - shown below greeting when chat hasn't started */}
            <div className="w-full max-w-3xl mt-6 ">
              <form onSubmit={handleChatSubmit} className="w-full">
                <div className="flex items-center  rounded-xl p-2 shadow-sm bg-transparent border-[0.5px] border-zinc-200 dark:border-zinc-700">
                  <Input
                    className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-transparent"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about mandates, trends, or pitching opportunities..."
                  />
                  <Button
                    type="submit"
                    className="rounded-xl bg-[#9747FF]   dark:bg-[#9747FF]  "
                  >
                    Send <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          // Messages area - shown when chat is started
          <div className=" w-full flex-1 overflow-hidden pt-4 z-[10]  ">
            <div className="h-10"></div>
            <ScrollArea className="h-[calc(100vh-120px)] w-full pr-4">
              <div className="space-y-6 pb-20 ">
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
                    <div className="text-base whitespace-pre-wrap ">
                      {m.content.length > 0 ? (
                        // m.content.includes("I'm your Mandate Wizard") ? (
                        //   <div className="text-base leading-snug">
                        //     <ReactMarkdown
                        //       components={{
                        //         p: ({ children }) => (
                        //           <p className="-my-1 leading-tight">
                        //             {children}
                        //           </p>
                        //         ),
                        //         ul: ({ children }) => (
                        //           <ul className="list-disc pl-5 m-0">
                        //             {children}
                        //           </ul>
                        //         ),
                        //         ol: ({ children }) => (
                        //           <ol className="list-none pl-5 m-0">
                        //             {children}
                        //           </ol>
                        //         ),
                        //         li: ({ children }) => {
                        //           // If child is a single <p>, unwrap it
                        //           const childArray =
                        //             React.Children.toArray(children);
                        //           const isWrappedInP =
                        //             childArray.length === 1 &&
                        //             (childArray[0] as any)?.type === "p";

                        //           return (
                        //             <li className="m-0 leading-tight">
                        //               {isWrappedInP
                        //                 ? (childArray[0] as any).props.children
                        //                 : children}
                        //             </li>
                        //           );
                        //         },
                        //         br: () => <br className="leading-tight" />,
                        //       }}
                        //     >
                        //       {m.content}
                        //     </ReactMarkdown>
                        //     <p>Try asking :</p>
                        //     <div className="mt-4 flex flex-col space-y-2">
                        //       {EXAMPLE_PROMPTS.map((prompt, index) => (
                        //         <Button
                        //           key={index}
                        //           variant="outline"
                        //           className="justify-start text-left h-auto whitespace-normal"
                        //           onClick={() => handlePromptClick(prompt)}
                        //         >
                        //           {`• ${prompt}`}
                        //         </Button>
                        //       ))}
                        //     </div>
                        //     <p className="mt-2">Ready to dive in? Just ask!</p>
                        //   </div>
                        // ) : (
                        <div className={style.reactMarkDown}>
                          <ReactMarkdown
                          >
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        // )
                        <span className="italic text-sm text-gray-500">
                          {"calling tool: " + m?.toolInvocations?.[0].toolName}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

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
               className="w-fit text-left text-[#130261]  h-auto whitespace-normal py-4 px-3 rounded-2xl
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

      {/* Chat Input - Fixed at bottom when chat starts */}
      {isChatStarted && (
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-3xl mx-auto p-4 z-[10]">
          <form
            onSubmit={handleChatSubmit}
            className="w-full bg-white dark:bg-black rounded-full "
          >
            <div className="flex items-center gap-2 rounded-xl p-3 shadow-sm bg-transparent border-[0.5px] border-gray-200 dark:border-gray-800">
              <Input
                className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-transparent"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about mandates, trends, or pitching opportunities..."
              />
              <Button
                type="submit"
                className="rounded-xl bg-[#9747FF]   dark:bg-[#9747FF]  "
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
