"use client"

import { useState, useEffect } from 'react'
import { ThumbsUp, MessageSquare, Plus, Rocket, Eye, Trash2, Clock, X, Send, ThumbsDown } from 'lucide-react'
import { ActivityLog } from '@/components/dashboard/activity-log'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { getIdeas, createIdea, updateIdea, deleteIdea, toggleIdeaLike, toggleIdeaDislike } from '@/app/actions/idea'
import { addComment } from '@/app/actions/comment'
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
    const [openCommentIdea, setOpenCommentIdea] = useState<any>(null)
    const [commentText, setCommentText] = useState('')

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

    const handleLike = async (e: React.MouseEvent, idea: any) => {
        e.stopPropagation()
        if (!currentUser) return

        // Optimistic update
        const isLiked = idea.votes?.some((v: any) => v.userId === currentUser.id)
        const isDisliked = idea.dislikes?.some((v: any) => v.userId === currentUser.id)

        const newIdeas = ideas.map(i => {
            if (i.id === idea.id) {
                let newVotes = [...(i.votes || [])]
                let newDislikes = [...(i.dislikes || [])]
                let newUpvotes = i.upvotes

                if (isLiked) {
                    newVotes = newVotes.filter(v => v.userId !== currentUser.id)
                    newUpvotes--
                } else {
                    newVotes.push({ userId: currentUser.id })
                    newUpvotes++
                    if (isDisliked) {
                        newDislikes = newDislikes.filter(v => v.userId !== currentUser.id)
                    }
                }
                return { ...i, votes: newVotes, dislikes: newDislikes, upvotes: newUpvotes }
            }
            return i
        })
        setIdeas(newIdeas)
        if (openCommentIdea?.id === idea.id) {
            setOpenCommentIdea(newIdeas.find(i => i.id === idea.id))
        }

        const result = await toggleIdeaLike(idea.id, currentUser.id)
        if (!result.success) {
            fetchData()
        }
    }

    const handleDislike = async (e: React.MouseEvent, idea: any) => {
        e.stopPropagation()
        if (!currentUser) return

        // Optimistic update
        const isLiked = idea.votes?.some((v: any) => v.userId === currentUser.id)
        const isDisliked = idea.dislikes?.some((v: any) => v.userId === currentUser.id)

        const newIdeas = ideas.map(i => {
            if (i.id === idea.id) {
                let newVotes = [...(i.votes || [])]
                let newDislikes = [...(i.dislikes || [])]
                let newUpvotes = i.upvotes

                if (isDisliked) {
                    newDislikes = newDislikes.filter(v => v.userId !== currentUser.id)
                } else {
                    newDislikes.push({ userId: currentUser.id })
                    if (isLiked) {
                        newVotes = newVotes.filter(v => v.userId !== currentUser.id)
                        newUpvotes--
                    }
                }
                return { ...i, votes: newVotes, dislikes: newDislikes, upvotes: newUpvotes }
            }
            return i
        })
        setIdeas(newIdeas)
        if (openCommentIdea?.id === idea.id) {
            setOpenCommentIdea(newIdeas.find(i => i.id === idea.id))
        }

        const result = await toggleIdeaDislike(idea.id, currentUser.id)
        if (!result.success) {
            fetchData()
        }
    }

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentUser || !openCommentIdea || !commentText.trim()) return

        const tempComment = {
            id: 'temp-' + Date.now(),
            content: commentText,
            createdAt: new Date().toISOString(),
            user: {
                name: currentUser.name,
                avatar: currentUser.avatar
            }
        }

        // Optimistic update
        const updatedIdea = {
            ...openCommentIdea,
            comments: [tempComment, ...(openCommentIdea.comments || [])]
        }
        setOpenCommentIdea(updatedIdea)
        setIdeas(ideas.map(i => i.id === openCommentIdea.id ? updatedIdea : i))
        setCommentText('')

        const result = await addComment({
            entityId: openCommentIdea.id,
            entityType: 'IDEA',
            content: tempComment.content,
            userId: currentUser.id
        })

        if (!result.success) {
            alert("Failed to add comment")
            fetchData()
        } else {
            // Silently refresh in background to ensure consistency
            getIdeas().then(data => {
                setIdeas(data)
                const currentOpen = data.find((i: any) => i.id === openCommentIdea.id)
                if (currentOpen) setOpenCommentIdea(currentOpen)
            })
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
                                                onClick={(e) => handleLike(e, idea)}
                                                className={cn(
                                                    "flex items-center gap-2 transition-colors pr-2",
                                                    idea.votes?.some((v: any) => v.userId === currentUser?.id)
                                                        ? "text-purple-600"
                                                        : "text-slate-500 hover:text-purple-600"
                                                )}
                                            >
                                                <ThumbsUp className={cn(
                                                    "w-4 h-4 transition-transform active:scale-110",
                                                    idea.votes?.some((v: any) => v.userId === currentUser?.id) && "fill-current"
                                                )} />
                                                <span className="font-medium">{idea.upvotes}</span>
                                            </button>

                                            <button
                                                onClick={(e) => handleDislike(e, idea)}
                                                className={cn(
                                                    "flex items-center gap-2 transition-colors pr-2",
                                                    idea.dislikes?.some((v: any) => v.userId === currentUser?.id)
                                                        ? "text-red-500"
                                                        : "text-slate-500 hover:text-red-500"
                                                )}
                                            >
                                                <ThumbsDown className={cn(
                                                    "w-4 h-4 transition-transform active:scale-110",
                                                    idea.dislikes?.some((v: any) => v.userId === currentUser?.id) && "fill-current"
                                                )} />
                                            </button>

                                            <button
                                                onClick={() => setOpenCommentIdea(idea)}
                                                className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                <span className="text-xs">{idea.comments?.length || 0}</span>
                                            </button>
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


            {/* Comment Modal */}
            <AnimatePresence>
                {
                    openCommentIdea && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setOpenCommentIdea(null)}
                                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-0 overflow-hidden flex flex-col max-h-[85vh]"
                            >
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{openCommentIdea.title}</h3>
                                        <p className="text-xs text-slate-500">Discussion</p>
                                    </div>
                                    <button
                                        onClick={() => setOpenCommentIdea(null)}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {openCommentIdea.comments?.length > 0 ? (
                                        openCommentIdea.comments.map((comment: any) => (
                                            <div key={comment.id} className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                                                    {comment.user?.avatar ? (
                                                        <img src={comment.user.avatar} className="w-full h-full object-cover" />
                                                    ) : (
                                                        (comment.user?.name || '?').charAt(0)
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl rounded-tl-none">
                                                        <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">{comment.user?.name || 'Unknown'}</p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-300">{comment.content}</p>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 pl-2">
                                                        {new Date(comment.createdAt).toLocaleDateString()} • {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-slate-400">
                                            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                            <p>No comments yet. Share your thoughts!</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                                    <form onSubmit={handleAddComment} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!commentText.trim()}
                                            className="p-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence >
        </div >
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
