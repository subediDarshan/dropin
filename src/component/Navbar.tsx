import {FaGithub} from 'react-icons/fa'
import Link from "next/link";
import React from "react";

function Navbar() {
    return (
        <>
            <nav className="w-full py-4">
                <div className="container mx-auto border-4 border-[#FF8383] rounded-4xl py-4 px-36 flex items-center justify-between">
                    {/* #56A2E8  blue */}
                    <Link href={"/"}><span className="text-4xl font-bold">Dropin</span></Link>
                    <a href={"https://github.com/subediDarshan/dropin"} target='_blank'><span className="text-4xl"><FaGithub className=" hover:text-gray-400" /></span></a>
                    
                </div>
            </nav>
        </>
    );
}

export default Navbar;
