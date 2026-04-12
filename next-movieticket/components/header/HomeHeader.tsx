"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useState } from "react";
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";

const HomeHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { loggedInUser, setLoggedInUserProfile } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    // 1. Clear local storage
    localStorage.removeItem("_at_movieticket");
    // 2. Reset Auth State
    setLoggedInUserProfile(null);
    // 3. Close mobile menu if open
    setIsMenuOpen(false);
    // 4. Redirect
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Movie", href: "/movie" },
    { name: "Upcoming Movie", href: "/upcomingmovie" },
    { name: "My Bookings", href: "/my-bookings" },
    { name: "About Us", href: "/about-us" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      <nav className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
        <div className="flex justify-between items-center mx-auto max-w-7xl">
          
          {/* 1. Logo Section */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src={logo}
              alt="CineTix Logo"
              width={45}
              height={45}
              className="rounded-full shadow-sm"
            />
            <span className="text-2xl font-black text-red-600 tracking-tighter">
              CineTix
            </span>
          </Link>

          {/* 2. Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <ul className="flex flex-row space-x-8 font-semibold">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-red-600 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Right Side: Auth Logic (Login or Profile) */}
          <div className="flex items-center lg:order-2 space-x-4">
            
            {loggedInUser ? (
              // --- Logged In View ---
              <div className="flex items-center space-x-3 md:space-x-5">
                
                {/* User Identity Card */}
                <div className="flex items-center space-x-2 group cursor-pointer">
                  <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full border-2 border-red-500 shadow-sm transition-transform group-hover:scale-105">
                    {loggedInUser.image?.secureUrl ? (
                      <Image
                        src={loggedInUser.image.secureUrl}
                        alt={loggedInUser.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-full h-full p-2 text-gray-400" />
                    )}
                  </div>
                  <div className="hidden md:flex flex-col">
                    <span className="text-sm font-bold text-gray-900 leading-tight">
                      {loggedInUser.name.split(" ")[0]}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                      {loggedInUser.role}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 md:px-4 md:py-2 flex items-center space-x-2 bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 border border-gray-100"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline font-bold text-sm">Logout</span>
                </button>
              </div>
            ) : (
              // --- Logged Out View ---
              <Link
                href="/login"
                className="bg-red-600 text-white hover:bg-red-700 font-bold rounded-xl text-sm px-6 py-2.5 shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center p-2 text-gray-600 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* 4. Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
            
            {/* Mobile Profile Display */}
            {loggedInUser && (
              <div className="flex items-center space-x-4 p-4 mt-4 bg-red-50 rounded-2xl">
                <div className="relative w-12 h-12 bg-white rounded-full overflow-hidden border-2 border-white shadow-md">
                   {loggedInUser.image?.secureUrl ? (
                      <Image src={loggedInUser.image.secureUrl} alt="User" fill className="object-cover" />
                    ) : (
                      <User className="p-3 text-gray-400" />
                    )}
                </div>
                <div>
                  <p className="font-black text-gray-900">{loggedInUser.name}</p>
                  <p className="text-xs text-gray-500">{loggedInUser.email}</p>
                </div>
              </div>
            )}

            <ul className="flex flex-col space-y-2 pt-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl font-semibold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              
              {loggedInUser && (
                <li className="pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={20} className="mr-3" /> Sign Out
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default HomeHeader;