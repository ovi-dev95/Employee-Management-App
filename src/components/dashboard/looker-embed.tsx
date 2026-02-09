"use client"

import { BarChart3, ExternalLink, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LookerEmbedProps {
    url?: string
    title?: string
    className?: string
    height?: string
}

export function LookerEmbed({
    url = "https://lookerstudio.google.com/embed/reporting/0b2b8e3e-4f3b-4f3b-4f3b-4f3b4f3b4f3b/page/1M", // Mock URL
    title = "Data Report",
    className,
    height = "600px"
}: LookerEmbedProps) {
    // If no real URL is provided, we show the enhanced placeholder
    const isMock = url.includes("0b2b8e3e");

    return (
        <div className={cn("w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col", className)}>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>

            <div className="relative bg-slate-50 dark:bg-slate-950 w-full" style={{ height, minHeight: height }}>
                {isMock ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <BarChart3 className="w-8 h-8 text-blue-500 opacity-40" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Looker Studio Integration</h4>
                        <p className="max-w-md text-slate-500 dark:text-slate-400 text-sm mb-6">
                            This is a live preview of where your Looker Studio report will appear.
                            Connect your Google Data Studio URL in the settings to start visualizing your real-time performance.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95">
                                Connect Data Source
                            </button>
                            <button className="px-5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                View Documentation
                            </button>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute bottom-4 left-6 right-6 flex justify-between opacity-30">
                            <div className="flex gap-2">
                                <div className="h-1.5 w-12 bg-slate-300 dark:bg-slate-700 rounded-full" />
                                <div className="h-1.5 w-8 bg-slate-300 dark:bg-slate-700 rounded-full" />
                            </div>
                            <div className="h-1.5 w-20 bg-slate-300 dark:bg-slate-700 rounded-full" />
                        </div>
                    </div>
                ) : (
                    <iframe
                        src={url}
                        className="w-full h-full border-0 absolute inset-0"
                        allowFullScreen
                        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                    />
                )}
            </div>
        </div>
    )
}
