"use client";

import React from "react";
import Image from "next/image";

export function AiLoadAnim() {
  return (
    <div className="flex justify-center py-4">
      <Image
        src="/ai_loadanim2.gif"
        alt="AI Loading Animation"
        width={400}
        height={400}
        unoptimized={true} // Important for GIFs in Next.js
      />
    </div>
  );
}
