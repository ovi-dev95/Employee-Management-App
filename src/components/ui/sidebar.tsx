"use client"

import { ModeToggle } from '@/components/mode-toggle'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    ClipboardList,
    BookOpen,
    Lightbulb,
    BarChart3,
    Settings,
    User,
    LogOut,
    PlusCircle,
    Menu,
    X,
} from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Attendance & Leave', href: '/dashboard/attendance', icon: ClipboardList },
    { name: 'Requests', href: '/dashboard/requests', icon: PlusCircle },
    { name: 'University', href: '/dashboard/university', icon: BookOpen },
    { name: 'Product Lab', href: '/dashboard/product-lab', icon: Lightbulb },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Mobile Header / Toggle */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/logo.png"
                            alt="Nexus Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="font-bold text-white">RM Employee</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Content */}
            <div className={cn(
                "flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800 transition-transform duration-300 ease-in-out z-50",
                "fixed inset-y-0 left-0 md:relative md:translate-x-0 pt-16 md:pt-0", // Add padding top on mobile to account for header if needed, or just let it slide over? 
                // Actually, if I use a fixed header, I might want the sidebar to be below it or cover it?
                // Standard pattern: Sidebar covers everything or pushes. 
                // Let's make it cover.
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="hidden md:flex flex-col items-center text-center p-6 border-b border-slate-800">
                    <div className="relative w-16 h-16 mb-3">
                        <Image
                            src="/logo.png"
                            alt="Nexus Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        RM Employee
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Management Tool</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <LayoutGroup>
                        {navigation.map((item) => {
                            const isActive = item.href === '/dashboard'
                                ? pathname === '/dashboard'
                                : pathname.startsWith(item.href)

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 group z-10",
                                        isActive ? "text-blue-400" : "text-slate-400 hover:text-white"
                                    )}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-blue-600/10 border border-blue-600/20 rounded-xl -z-10"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white")} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </LayoutGroup>
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <Link
                        href="/dashboard/profile"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                            pathname === '/dashboard/profile'
                                ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                        )}
                    >
                        <User className="w-5 h-5" />
                        <span className="font-medium">My Profile</span>
                    </Link>

                    <div className="px-4 py-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-medium uppercase tracking-wider">Theme</span>
                            <ModeToggle />
                        </div>
                    </div>

                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </div>
        </>
    )
}
