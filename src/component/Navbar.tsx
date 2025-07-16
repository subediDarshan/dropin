import {FaGithub} from 'react-icons/fa'
import Link from "next/link";
import React from "react";

function Navbar() {
    return (
        <nav className="w-full py-4">
            <div className="container mx-auto border-4 border-[#FF8383] rounded-4xl py-4 px-4 sm:px-8 lg:px-36 flex items-center justify-between">
                <Link href={"/"}>
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold">Dropin</span>
                </Link>
                <a href={"https://github.com/subediDarshan/dropin"} target='_blank' rel="noopener noreferrer">
                    <span className="text-2xl sm:text-3xl lg:text-4xl">
                        <FaGithub className="hover:text-gray-400 transition-colors" />
                    </span>
                </a>
            </div>
        </nav>
    );
}

export default Navbar;
