// src/component/layout/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CozyClips from "../../assets/navbar/CozyClips.png"
import MoneyIcon from "../../assets/navbar/moneyIcon.png"
import Profile from "../../assets/navbar/Profile.png"

export default function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="w-full bg-[#870022] text-white shadow-lg">
            <div className="flex items-center justify-between h-16 px-4">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <a href="#">
                        <img src={CozyClips} alt="Brand Logo" className="h-12 w-auto" />
                    </a>
                </div>

                {/* Desktop Menu */}
                <div className="flex items-center space-x-4">
                    <a
                        href="#"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black transition-colors"
                    >
                        Home
                    </a>
                    <a
                        href="#"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black transition-colors"
                    >
                        Library
                    </a>
                    <a
                        href="#"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black transition-colors"
                    >
                        Challenges
                    </a>
                    <a
                        href="#"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black transition-colors"
                    >
                        Shop
                    </a>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Money Icon with count */}
                    <button
                        type="button"
                        aria-label="Wallet"
                        className="flex items-center space-x-1 px-2 py-1 rounded-md text-white hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 active:scale-[0.98]"
                        onClick={() => { /* TODO: navigate or open wallet modal */ }}
                    >
                        <img src={MoneyIcon} alt="Money" className="h-8 w-auto" />
                        <span className="font-medium">0</span>
                    </button>

                    {/* Profile Icon (clickable) */}
                    <button
                        type="button"
                        aria-label="Profile"
                        className="flex items-center rounded-full p-0 focus:outline-none focus:ring-2 focus:ring-white/60 hover:opacity-90 active:scale-[0.98]"
                        onClick={() => navigate('/settings')}
                    >
                        <img src={Profile} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                    </button>
                </div>

            </div>
        </nav>
    );
}
