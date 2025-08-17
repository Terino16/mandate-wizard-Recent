import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/general/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden  bg-white dark:bg-black">
      {/* Background Image with Overlay */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="w-[100px] h-[100px] bg-purple-500 rounded-full absolute top-4 left-4 blur-[150px]" />

      <div className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] bg-blue-700 rounded-full absolute -top-4 -right-4 blur-[200px]" />

      <div className="w-[100px] h-[100px] md:w-[400px] md:h-[400px] bg-[#9D4EDD] rounded-full absolute -bottom-4  blur-[250px]" />

      {/* Main Content Container with padding for navbar */}
      <div className="relative z-20 container mx-auto px-4">
        {/* Navbar */}

        {/* Hero Section */}
        <div className="flex-grow flex items-center justify-center ">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-8">
              {/* Main Heading */}
              <h1 className="text-black/80 dark:text-white text-5xl md:text-7xl tracking-tight font-sans">
                Stay ahead of{" "}
                <span
                  className={` italic tracking-tight bg-gradient-to-r from-purple-500 to-purple-900 dark:from-purple-500 dark:to-purple-300 text-transparent bg-clip-text`}
                >
                  mandates
                </span>{" "}
                and pitch{" "}
                <span
                  className={`italic tracking-tight bg-gradient-to-r from-purple-500 to-purple-900 dark:from-purple-500 dark:to-purple-300 text-transparent bg-clip-text`}
                >
                  smarter.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm md:text-lg text-black/80 dark:text-gray-400 font-sans tracking-tight md:max-w-3xl mx-auto">
                Mandate Wizard tracks real-time opportunities across
                film, TV, and IP — helping creators and executives
                pitch the right projects to the right people, faster
                than ever.
              </p>

              <div className="mt-4">
                <Link href="/chat">
                  <Button className="rounded-xl bg-[#9747FF] dark:hover:bg-[#b882ff] dark:bg-[#9747FF]">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
