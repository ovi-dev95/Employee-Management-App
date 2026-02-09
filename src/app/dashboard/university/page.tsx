"use client"

import { useState } from 'react'
import { PlayCircle, FileText, Search, CheckSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const sops = [
    {
        id: '1',
        title: 'How to Deploy to Vercel',
        category: 'WEB_DEV',
        views: 342,
        duration: '5 min',
        thumbnail: 'bg-gradient-to-br from-black to-slate-800',
    },
    {
        id: '2',
        title: 'SEO Checklist for New Pages',
        category: 'SEO',
        views: 890,
        duration: '12 min',
        thumbnail: 'bg-gradient-to-br from-blue-600 to-indigo-700',
    },
    {
        id: '3',
        title: 'Paid Media Naming Conventions',
        category: 'PAID_MEDIA',
        views: 120,
        duration: '8 min',
        thumbnail: 'bg-gradient-to-br from-green-500 to-emerald-700',
    },
    {
        id: '4',
        title: 'Onboarding New Team Members',
        category: 'GENERAL',
        views: 45,
        duration: '15 min',
        thumbnail: 'bg-gradient-to-br from-orange-400 to-red-500',
    },
    {
        id: '5',
        title: 'Handling Client Disputes',
        category: 'GENERAL',
        views: 67,
        duration: '10 min',
        thumbnail: 'bg-gradient-to-br from-purple-500 to-pink-600',
    },
]

const categories = ['ALL', 'WEB_DEV', 'SEO', 'PAID_MEDIA', 'GENERAL']

export default function UniversityPage() {
    const [selectedCategory, setSelectedCategory] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredSops = sops.filter(sop => {
        const matchesCategory = selectedCategory === 'ALL' || sop.category === selectedCategory
        const matchesSearch = sop.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">University</h1>
                    <p className="text-slate-500 dark:text-slate-400">SOPs, Training, and Knowledge Base</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search SOPs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                </div>
            </header>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                            selectedCategory === cat
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800"
                        )}
                    >
                        {cat.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* SOP Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSops.map((sop) => (
                    <motion.div
                        key={sop.id}
                        whileHover={{ y: -4 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group cursor-pointer"
                    >
                        <div className={cn("h-40 relative flex items-center justify-center", sop.thumbnail)}>
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <PlayCircle className="w-6 h-6 text-white" />
                            </div>
                            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-md">
                                {sop.duration}
                            </span>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wider">
                                    {sop.category.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <FileText className="w-3 h-3" /> {sop.views} views
                                </span>
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                                {sop.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <CheckSquare className="w-3 h-3" /> Includes Checklist
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
