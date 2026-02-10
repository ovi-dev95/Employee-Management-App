"use client"

import { useState, useEffect } from 'react'
import { AlertCircle, Palette, FileText, Send, CheckCircle2, Clock, Trash2, Edit2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { ActivityLog } from '@/components/dashboard/activity-log'
import { getRequests, createRequest, updateRequest, deleteRequest } from '@/app/actions/request'
import { getCurrentUser } from '@/app/actions/user'

const requestTypes = [
    {
        id: 'BUG',
        title: 'Bug Reporter',
        description: 'Something broken? Let us know so we can fix it.',
        icon: AlertCircle,
        color: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30',
    },
    {
        id: 'DESIGN',
        title: 'Design Request',
        description: 'Need visuals? Log a request for the UI/UX team.',
        icon: Palette,
        color: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/10 dark:text-purple-400 dark:border-purple-900/30',
    },
    {
        id: 'CONTENT',
        title: 'Content Brief',
        description: 'Request new blog posts, copy, or SEO updates.',
        icon: FileText,
        color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/30',
    },
    {
        id: 'LEAVE',
        title: 'Leave Request',
        description: 'Schedule time off or sick leave.',
        icon: Clock,
        color: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/30',
    },
]

const requestSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(10, 'Description must be detailed'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
})

type RequestFormData = z.infer<typeof requestSchema>

export default function RequestsPage() {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [requests, setRequests] = useState<any[]>([])
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<'NEW' | 'MY_REQUESTS' | 'ALL_REQUESTS'>('NEW')
    const [selectedCategory, setSelectedCategory] = useState('ALL')
    const [editingRequest, setEditingRequest] = useState<any>(null)

    const { register, handleSubmit, formState: { errors }, reset } = useForm<RequestFormData>({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            priority: 'MEDIUM'
        }
    })

    const fetchData = async () => {
        const [requestsData, userData] = await Promise.all([
            getRequests(),
            getCurrentUser()
        ])
        setRequests(requestsData)
        setCurrentUser(userData)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const onSubmit = async (data: RequestFormData) => {
        if (!currentUser || !selectedType) return

        const result = await createRequest({
            ...data,
            type: selectedType,
            submittedBy: currentUser.id
        })

        if (result.success) {
            setIsSubmitted(true)
            fetchData()
            setTimeout(() => {
                setIsSubmitted(false)
                setSelectedType(null)
                reset()
                setActiveTab('MY_REQUESTS')
            }, 2000)
        } else {
            alert('Failed to submit request: ' + result.error)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingRequest) return

        const result = await updateRequest(editingRequest.id, {
            title: editingRequest.title,
            description: editingRequest.description,
            priority: editingRequest.priority,
            status: editingRequest.status
        })

        if (result.success) {
            setEditingRequest(null)
            fetchData()
        } else {
            alert('Failed to update request: ' + result.error)
        }
    }

    const handleStatusChange = async (id: string, newStatus: string) => {
        const result = await updateRequest(id, { status: newStatus })
        if (result.success) {
            fetchData()
        } else {
            alert('Failed to update status: ' + result.error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this request?')) return
        const result = await deleteRequest(id)
        if (result.success) {
            fetchData()
        } else {
            alert('Failed to delete request: ' + result.error)
        }
    }

    const filteredRequests = requests.filter(req => {
        let matchesTab = true;
        if (activeTab === 'MY_REQUESTS') matchesTab = req.submittedBy === currentUser?.id
        // ALL_REQUESTS shows everything, NEW shows only form (handled in render)

        const matchesCategory = selectedCategory === 'ALL' || req.type === selectedCategory
        return matchesTab && matchesCategory
    })

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto relative">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Requests</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage and track your submitted requests.</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('NEW')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'NEW' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                    >
                        New Request
                    </button>
                    <button
                        onClick={() => setActiveTab('MY_REQUESTS')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'MY_REQUESTS' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                    >
                        My Requests ({requests.filter(r => r.submittedBy === currentUser?.id).length})
                    </button>
                    {currentUser?.role === 'ADMIN' && (
                        <button
                            onClick={() => setActiveTab('ALL_REQUESTS')}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                activeTab === 'ALL_REQUESTS' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            All Requests ({requests.length})
                        </button>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    {activeTab === 'NEW' ? (
                        <>
                            {!selectedType ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {requestTypes.map((type) => (
                                        <motion.div
                                            key={type.id}
                                            whileHover={{ y: -4 }}
                                            onClick={() => setSelectedType(type.id)}
                                            className={cn(
                                                "p-8 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-4 group",
                                                type.color
                                            )}
                                        >
                                            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                                <type.icon className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{type.title}</h3>
                                                <p className="text-sm opacity-80 mt-2">{type.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 max-w-2xl mx-auto relative"
                                >
                                    <button
                                        onClick={() => setSelectedType(null)}
                                        className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>

                                    <div className="mb-8 flex items-center gap-4">
                                        <div className={cn("p-4 rounded-2xl", requestTypes.find(t => t.id === selectedType)?.color)}>
                                            {(() => {
                                                const Icon = requestTypes.find(t => t.id === selectedType)?.icon
                                                return Icon ? <Icon className="w-8 h-8" /> : null
                                            })()}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                New {requestTypes.find(t => t.id === selectedType)?.title}
                                            </h2>
                                            <p className="text-slate-500">Fill in the details for your request.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Title</label>
                                            <input
                                                {...register('title')}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                                placeholder="Brief summary of the request"
                                            />
                                            {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Priority</label>
                                                <select
                                                    {...register('priority')}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                                >
                                                    <option value="LOW">Low - When possible</option>
                                                    <option value="MEDIUM">Medium - Standard workflow</option>
                                                    <option value="HIGH">High - Important deadline</option>
                                                    <option value="URGENT">Urgent - Blocks production</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Description</label>
                                            <textarea
                                                {...register('description')}
                                                rows={5}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm resize-none"
                                                placeholder="Provide as much detail as possible..."
                                            />
                                            {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitted}
                                            className={cn(
                                                "w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all shadow-lg shadow-blue-500/10",
                                                isSubmitted
                                                    ? "bg-green-500 text-white"
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                            )}
                                        >
                                            {isSubmitted ? (
                                                <>
                                                    <CheckCircle2 className="w-6 h-6" /> Request Sent!
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" /> Submit Request
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                {['ALL', 'BUG', 'DESIGN', 'CONTENT', 'LEAVE'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap",
                                            selectedCategory === cat
                                                ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900"
                                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                {filteredRequests.length === 0 ? (
                                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500">No requests found in this category.</p>
                                    </div>
                                ) : (
                                    filteredRequests.map(req => (
                                        <div key={req.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 group">
                                            <div className="shrink-0 flex flex-col items-center gap-2">
                                                <div className={cn("p-3 rounded-xl", requestTypes.find(t => t.id === req.type)?.color)}>
                                                    {(() => {
                                                        const Icon = requestTypes.find(t => t.id === req.type)?.icon
                                                        return Icon ? <Icon className="w-6 h-6" /> : <FileText className="w-6 h-6" />
                                                    })()}
                                                </div>
                                                {currentUser?.role === 'ADMIN' && req.status === 'PENDING' && (
                                                    <div className="flex flex-col gap-1">
                                                        <button
                                                            onClick={() => handleStatusChange(req.id, 'APPROVED')}
                                                            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Approve"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(req.id, 'REJECTED')}
                                                            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Reject"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={cn(
                                                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                                        req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                            req.status === 'APPROVED' || req.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    )}>
                                                        {req.status}
                                                    </span>
                                                    <span className={cn(
                                                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                                        req.priority === 'URGENT' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                                                    )}>
                                                        {req.priority}
                                                    </span>
                                                    {activeTab === 'ALL_REQUESTS' && req.user && (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 ml-auto">
                                                            {req.user.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-bold text-slate-900 dark:text-white truncate">{req.title}</h3>
                                                <p className="text-sm text-slate-500 truncate">{req.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditingRequest(req)}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-500 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(req.id)}
                                                    className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <aside className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" /> Request History
                        </h3>
                        <ActivityLog limit={6} category="REQUESTS" />
                    </div>
                </aside>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingRequest && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingRequest(null)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Edit Request</h2>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300 uppercase tracking-tighter">Title</label>
                                    <input
                                        value={editingRequest.title}
                                        onChange={e => setEditingRequest({ ...editingRequest, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300 uppercase tracking-tighter">Priority</label>
                                        <select
                                            value={editingRequest.priority}
                                            onChange={e => setEditingRequest({ ...editingRequest, priority: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                            <option value="URGENT">Urgent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300 uppercase tracking-tighter">Status</label>
                                        <select
                                            value={editingRequest.status}
                                            onChange={e => setEditingRequest({ ...editingRequest, status: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-blue-600 font-bold"
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="COMPLETED">COMPLETED</option>
                                            <option value="REJECTED">REJECTED</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300 uppercase tracking-tighter">Description</label>
                                    <textarea
                                        rows={4}
                                        value={editingRequest.description}
                                        onChange={e => setEditingRequest({ ...editingRequest, description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setEditingRequest(null)}
                                        className="px-6 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
