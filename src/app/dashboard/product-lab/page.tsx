"use client"

import { useState, useEffect } from 'react'
import { ThumbsUp, MessageSquare, Plus, Rocket, Eye, Trash2, Clock } from 'lucide-react'
import { ActivityLog } from '@/components/dashboard/activity-log'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { getIdeas, createIdea, updateIdea, deleteIdea, toggleVote } from '@/app/actions/idea'
import { getCurrentUser } from '@/app/actions/user'

const ideaSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(10, 'Description must be detailed'),
})

type IdeaFormData = z.infer<typeof ideaSchema>

interface Idea {
    id: string
    title: string
    description: string
    status: 'REVIEW' | 'APPROVED' | 'BUILDING' | 'REJECTED'
    upvotes: number
    submittedBy: string
    user?: {
        name: string
        avatar?: string
    }
    votes?: { userId: string }[]
}

export default function ProductLabPage() {
    const [ideas, setIdeas] = useState<any[]>([])
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'NEW' | 'MY_IDEAS' | 'ALL_IDEAS'>('NEW')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm<IdeaFormData>({
        resolver: zodResolver(ideaSchema),
    })

    const fetchData = async () => {
        setIsLoading(true)
        const [ideasData, userData] = await Promise.all([
            getIdeas(),
            getCurrentUser()
        ])
        setIdeas(ideasData)
        setCurrentUser(userData)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const onSubmit = async (data: IdeaFormData) => {
        if (!currentUser) return

        const result = await createIdea({
            ...data,
            submittedBy: currentUser.id
        })

        if (result.success) {
            setIsSubmitted(true)
            fetchData()
            setTimeout(() => {
                setIsSubmitted(false)
                reset()
                setActiveTab('MY_IDEAS')
            }, 2000)
        } else {
            alert("Failed to submit idea: " + result.error)
        }
    }

    const handleUpvote = async (ideaId: string) => {
        if (!currentUser) return
        const result = await toggleVote(ideaId, currentUser.id)
        if (result.success) {
            fetchData()
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this idea?')) {
            const result = await deleteIdea(id)
            if (result.success) {
                fetchData()
            }
        }
    }

    const filteredIdeas = ideas.filter(idea => {
        if (activeTab === 'MY_IDEAS') return idea.submittedBy === currentUser?.id
        return true
    })

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                        Product Lab <Rocket className="w-8 h-8 text-purple-500" />
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Innovation Board - Pitch your ideas!</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('NEW')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'NEW' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                    >
                        New Idea
                    </button>
                    <button
                        onClick={() => setActiveTab('MY_IDEAS')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'MY_IDEAS' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                    >
                        My Ideas
                    </button>
                    <button
                        onClick={() => setActiveTab('ALL_IDEAS')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'ALL_IDEAS' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                    >
                        All Ideas
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    {activeTab === 'NEW' ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 max-w-2xl mx-auto"
                        >
                            <div className="mb-8 flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                    <Rocket className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        Pitch Your Idea
                                    </h2>
                                    <p className="text-slate-500">Share your vision for the next big thing.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Title</label>
                                    <input
                                        {...register('title')}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm"
                                        placeholder="Make it catchy..."
                                    />
                                    {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Description</label>
                                    <textarea
                                        {...register('description')}
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm resize-none"
                                        placeholder="What problem does this solve?"
                                    />
                                    {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitted}
                                    className={cn(
                                        "w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all shadow-lg shadow-purple-500/10",
                                        isSubmitted
                                            ? "bg-green-500 text-white"
                                            : "bg-purple-600 text-white hover:bg-purple-700"
                                    )}
                                >
                                    {isSubmitted ? (
                                        <>
                                            <ThumbsUp className="w-6 h-6" /> Idea Submitted!
                                        </>
                                    ) : (
                                        <>
                                            <Rocket className="w-5 h-5" /> Launch Idea
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-min">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="h-56 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
                                ))
                            ) : filteredIdeas.length === 0 ? (
                                <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-900 border border-dashed rounded-3xl flex flex-col items-center justify-center">
                                    <Rocket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium">No ideas found in this category.</p>
                                </div>
                            ) : (
                                filteredIdeas.map((idea) => (
                                    <motion.div
                                        key={idea.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="glass-card p-6 rounded-2xl flex flex-col justify-between min-h-[14rem] group hover:scale-[1.02] transition-all relative"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <StatusBadge status={idea.status} />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-400">by {idea.user?.name || 'Anonymous'}</span>
                                                    {currentUser?.id === idea.submittedBy && (
                                                        <button
                                                            onClick={() => handleDelete(idea.id)}
                                                            className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2">{idea.title}</h3>
                                            <p className="text-sm text-slate-500 line-clamp-3">{idea.description}</p>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                                            <button
                                                onClick={() => handleUpvote(idea.id)}
                                                className={cn(
                                                    "flex items-center gap-2 transition-colors group/btn",
                                                    idea.votes?.some((v: any) => v.userId === currentUser?.id)
                                                        ? "text-purple-600"
                                                        : "text-slate-500 hover:text-purple-600"
                                                )}
                                            >
                                                <ThumbsUp className={cn(
                                                    "w-4 h-4 group-hover/btn:scale-110 transition-transform",
                                                    idea.votes?.some((v: any) => v.userId === currentUser?.id) && "fill-current"
                                                )} />
                                                <span className="font-medium">{idea.upvotes}</span>
                                            </button>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <MessageSquare className="w-4 h-4" />
                                                <span className="text-xs">0</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <aside className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-500" /> Idea History
                        </h3>
                        <ActivityLog limit={6} category="PRODUCT_LAB" />
                    </div>
                </aside>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: Idea['status'] }) {
    const styles = {
        REVIEW: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        APPROVED: 'bg-green-100 text-green-700 border-green-200',
        BUILDING: 'bg-blue-100 text-blue-700 border-blue-200',
        REJECTED: 'bg-red-100 text-red-700 border-red-200',
    }

    return (
        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider shadow-sm", styles[status])}>
            {status}
        </span>
    )
}
