"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import Link from "next/link";

import { authClient } from "@/lib/authclient";
import { useRouter } from "next/navigation";


export default function ClientNav({ credits, onCreditsUpdate }: { credits: number | undefined; onCreditsUpdate?: (newCredits: number) => void }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const session = await authClient.getSession();
        console.log(session);
        if (session?.data?.user) {
          setUser(session.data.user);
          
          // Check if this is a new Google signup and we have a stored name
          const signupName = localStorage.getItem("signup_name");
          if (signupName && (!session.data.user.name || session.data.user.name === "")) {
            try {
              // Update the user's name in the database
              const response = await fetch("/api/auth/update-user", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: signupName,
                }),
              });

              if (response.ok) {
                localStorage.removeItem("signup_name"); // Clean up
                // Refresh the user data
                const updatedSession = await authClient.getSession();
                if (updatedSession?.data?.user) {
                  setUser(updatedSession.data.user);
                }
              }
            } catch (error) {
              console.error("Error updating user name:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error checking user session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2">

     
      <Button
      asChild
      variant="outline"
      size="sm">
      <Link href="/login">  
          <span>Login</span>
      </Link>
  </Button>
  <Button
      asChild
      size="sm">
      <Link href="/signup">
          <span>Sign Up</span>
      </Link>
  </Button>
  </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image} alt={"USER"} />
            <AvatarFallback className="bg-gray-100 text-gray-800">
             {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none text-muted-foreground py-2">
              <span className={`font-bold ${credits !== undefined && credits <= 5 ? 'text-red-500' : credits !== undefined && credits <= 20 ? 'text-yellow-500' : ''}`}>
                {credits}
              </span> credits 
              {credits !== undefined && credits <= 5 && (
                <span className="text-xs text-red-500 ml-2">Low credits!</span>
              )}
            </p>
            <p className="text-sm font-medium leading-none">
              {user.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
