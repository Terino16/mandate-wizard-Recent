import { buttonVariants } from "@/components/ui/button";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";


export default  function AuthLayout({children}:{children:React.ReactNode})
{
    return(
        <div className=" relative flex flex-col items-center justify-center min-h-screen">
            <Link href="/" className={buttonVariants(
                {
                    variant:'outline',
                    className:'absolute left-4 top-4'
                }
            )}>
                <ArrowLeftIcon className="mr-1 h-4 w-4" />
                Back 
            </Link>

            <div className="absolute right-4 top-4">
                
            </div>
            {children}
        </div>
    )
}