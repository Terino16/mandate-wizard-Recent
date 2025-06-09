"use client";

import { useEffect, useState } from "react";
import { ModeToggle } from "../misc/ModeToggle";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

export function Navbar() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMounted(true), []);

  // Listen for scroll to toggle background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const logoTextSrc =
    currentTheme === "dark"
      ? "/mandatewizarddark.svg"
      : "/mandatewizardlight.svg";

  return (
    <header
      className={`
        z-50 w-full fixed top-2 left-0 transition-all duration-300
        flex justify-between items-center mx-auto rounded-full px-4 md:px-12 py-1
        ${scrolled
          ? "bg-white/80 dark:bg-black/70 border-b border-b-secondary shadow-lg backdrop-blur-md"
          : "bg-transparent border-b-0 shadow-none"}
      `}
      style={{ backdropFilter: scrolled ? "blur(12px)" : "none" }}
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-4">
        <Link className="flex flex-row gap-2 items-center" href="/">
          <Image
            src="/Logo.svg"
            alt="Mandate Wizard Logo"
            width={32}
            height={32}
          />
          {mounted && (
            <Image
              src={logoTextSrc}
              alt="Mandate Wizard Logo Text"
              width={160}
              height={32}
              priority
            />
          )}
        </Link>
      </div>

      {/* Right-side controls */}
      <div className="flex items-center gap-4">
        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          <Button className="bg-[#9747FF]" asChild>
            <Link href="/chat">Chat</Link>
          </Button>
        </div>

        {/* Mode Toggle - Always Visible */}
        <ModeToggle />

        {/* Mobile Controls */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/chat">
                  <span>Chat</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
