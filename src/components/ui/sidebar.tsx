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
    PlusCircle
} from 'lucide-react'
import { logout } from '@/app/actions/auth'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Attendance & Leave', href: '/dashboard/attendance', icon: ClipboardList },
    { name: 'Submit Request', href: '/dashboard/requests/new', icon: PlusCircle },
    { name: 'University', href: '/dashboard/university', icon: BookOpen },
    { name: 'Product Lab', href: '/dashboard/product-lab', icon: Lightbulb },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800">
            <div className="p-6 border-b border-slate-800 flex flex-col items-center text-center">
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
                {navigation.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400 shadow-sm border border-blue-600/20"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white")} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-2">
                <Link
                    href="/dashboard/profile"
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
    )
}
