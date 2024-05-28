'use client'

import { useState } from "react"

export default function MainLayoutPage({ children }) {

    const [showSidebar, setShowSidebar] = useState(false)

    return (
        <div className="w-full h-screen flex">
            <div className="md:w-2/12 hidden md:block h-full relative overflow-auto bg-zinc-900 p-5">
                
            </div>
            {showSidebar ? <Sidebar setShowSidebar={setShowSidebar} /> : (
                <div className="md:w-10/12 w-full">
                    {children}
                </div>
            )}
        </div>
    )
}

function Sidebar({ setShowSidebar }) {
    return (
        <div className="md:hidden w-full h-full relative overflow-auto">sidebar</div>
    )
}