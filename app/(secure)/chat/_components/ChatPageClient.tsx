"use client";

import { useState } from "react";
import { HeroHeader } from "./Navbar";
import { ChatClient } from "./ChatClient";

interface ChatPageClientProps {
  initialCredits: number | undefined;
}

export function ChatPageClient({ initialCredits }: ChatPageClientProps) {
  const [credits, setCredits] = useState(initialCredits);

  const handleCreditsUpdate = (newCredits: number) => {
    setCredits(newCredits);
  };

  return (
    <div>
      <HeroHeader credits={credits} onCreditsUpdate={handleCreditsUpdate} />
      <ChatClient credits={credits} onCreditsUpdate={handleCreditsUpdate} />
    </div>
  );
}
