"use client"

import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-20 h-9 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700" />
    }

    return (
        <div
            className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 cursor-pointer shadow-inner w-20 h-9 relative"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {/* Toggle Indicator */}
            <motion.div
                className="absolute top-1 bottom-1 bg-white dark:bg-slate-600 rounded-full shadow-sm w-8 z-10"
                animate={{ left: theme === "dark" ? "calc(100% - 36px)" : "4px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />

            {/* Icons */}
            <div className="absolute left-2 w-full flex justify-between px-1 z-20 pointer-events-none">
                <Sun className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-amber-500'}`} />
                <Moon className={`w-4 h-4 mr-4 ${theme === 'dark' ? 'text-blue-400' : 'text-slate-300'}`} />
            </div>
        </div>
    )
}
