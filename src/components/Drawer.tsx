"use client";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { useUserStore } from "@/store/useUserStore";
import { getUser } from "@/app/api/users/actions";
import { useRouter, usePathname } from "next/navigation";
import { signout } from "@/app/login/actions";


const DRAWER_MENU = [
    {
        name: "Home",
        path: "/home",
        svg: <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    },
    {
        name: "Calendar",
        path: "/calendar",
        svg: <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    },
    {
        name: "Friends",
        path: "/friends",
        svg: <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197v1M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    }
]



export default function Drawer() {
    
    const [isOpen, setIsOpen] = useState(false);
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        getUserSupabase();
    }, []);

    const getUserSupabase = async () => {
        try {
            const userServ = await getUser();
            if (userServ) {
                setUser(userServ);
                return true;
            }
            router.push("/login");
        } catch (error) {
            router.push("/login");
        }
    }

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const navigateTo = (path: string) => {
        setIsOpen(false);
        router.push(path);
    };

    const onSignOut = async () => {
        try {
            await signout();
            setUser(null);
            setIsOpen(!isOpen);
            router.push("/login");
        } catch (error) {
            console.log(error);
        }
    };

    
    return (
        <>
            { user && <button
                onClick={toggleDrawer}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle menu"
            >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                    <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
                </div>
            </button>
            }

            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={toggleDrawer}
            ></div>

            {/* Drawer */}
            <div
                className={`fixed left-0 top-0 h-full w-80 bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Profile Section */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex flex-col items-center">
                        <div className="relative w-20 h-20 mb-4">
                            <Image
                                src="/favicon.png"
                                alt="Profile Picture"
                                width={80}
                                height={80}
                                
                            />
                        </div>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                    </div>
                </div>
                

                {/* Navigation Menu */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        { DRAWER_MENU.map((item) => (
                            <li key={item.name}>
                                <button
                                    onClick={() => navigateTo(item.path)}
                                    className={`flex items-center px-4 py-3 !text-white rounded-lg transition-colors duration-200 w-full ${pathname === item.path ? 'bg-gray-800' : ''}`}
                                >
                                    {item.svg}
                                    {item.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer Section */}
                <div className="p-4 border-t border-gray-700">
                    <button className="flex items-center w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200" onClick={onSignOut}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    )
}