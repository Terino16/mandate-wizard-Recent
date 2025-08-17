import { Navbar } from "@/components/general/Navbar"
export default function HomeLayout({children}:{children:React.ReactNode}){
    return(
        <div className="bg-black overflow-hidden">
            <Navbar/>
            {children}
        </div>
    )
}