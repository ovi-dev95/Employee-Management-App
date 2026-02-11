"use client"

import { useState, useEffect } from 'react'
import { PlayCircle, FileText, Search, CheckSquare, Plus, X, Trash2, Eye, Clock } from 'lucide-react'
import { ActivityLog } from '@/components/dashboard/activity-log'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getSOPs, createSOP, deleteSOP, updateSOP, incrementSOPViews } from '@/app/actions/sop'
import { getCurrentUser } from '@/app/actions/user'

const categories = ['ALL', 'WEB_DEV', 'SEO', 'PAID_MEDIA', 'GENERAL']

export default function UniversityPage() {
    const [selectedCategory, setSelectedCategory] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    const [sops, setSops] = useState<any[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newSop, setNewSop] = useState({
        title: '',
        category: 'GENERAL',
        videoUrl: '',
        docUrl: '',
        featureImage: '',
        content: ''
    })
    const [editingSop, setEditingSop] = useState<any>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const [currentUser, setCurrentUser] = useState<any>(null)

    const fetchSops = async () => {
        try {
            const [data, userData] = await Promise.all([
                getSOPs(),
                getCurrentUser()
            ])
            setSops(data)
            setCurrentUser(userData)
        } catch (error) {
            console.error("fetchSops error:", error)
        }
    }

    useEffect(() => {
        fetchSops()
    }, [])

    const handleAddSop = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentUser) {
            alert("You must be logged in to add an SOP")
            return
        }
        setIsSubmitting(true)
        const result = await createSOP({ ...newSop, userId: currentUser.id })
        if (result.success) {
            setIsAddModalOpen(false)
            setNewSop({ title: '', category: 'GENERAL', videoUrl: '', docUrl: '', featureImage: '', content: '' })
            fetchSops()
        } else {
            alert('Failed to add SOP: ' + result.error)
        }
        setIsSubmitting(false)
    }

    const handleEditSop = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingSop || !currentUser) return
        setIsSubmitting(true)
        const result = await updateSOP(editingSop.id, {
            title: editingSop.title,
            category: editingSop.category,
            videoUrl: editingSop.videoUrl,
            docUrl: editingSop.docUrl,
            featureImage: editingSop.featureImage,
            content: editingSop.content,
            userId: currentUser.id
        })
        if (result.success) {
            setIsEditModalOpen(false)
            setEditingSop(null)
            fetchSops()
        } else {
            alert('Failed to update SOP: ' + result.error)
        }
        setIsSubmitting(false)
    }

    const handleDeleteSop = async (id: string) => {
        if (confirm('Are you sure you want to delete this SOP?')) {
            const result = await deleteSOP(id)
            if (result.success) {
                fetchSops()
            }
        }
    }

    const handleOpenSop = async (sop: any) => {
        // Increment views
        await incrementSOPViews(sop.id)
        fetchSops()
        // Here you would typically open a viewer modal or navigate
        if (sop.docUrl) {
            window.open(sop.docUrl, '_blank')
        } else {
            alert(`Opening SOP: ${sop.title}\n\nContent: ${sop.content}`)
        }
    }

    const filteredSops = sops.filter(sop => {
        const matchesCategory = selectedCategory === 'ALL' || sop.category === selectedCategory
        const matchesSearch = sop.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto relative">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">University</h1>
                    <p className="text-slate-500 dark:text-slate-400">SOPs, Training, and Knowledge Base</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search SOPs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-md shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" /> Add SOP
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">

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
                        {filteredSops.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center p-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/10">
                                <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                                <p className="text-slate-500 font-medium text-lg">No SOPs found</p>
                                <p className="text-slate-400 mt-1">Start by adding your first Standard Operating Procedure</p>
                            </div>
                        ) : (
                            filteredSops.map((sop) => (
                                <motion.div
                                    key={sop.id}
                                    whileHover={{ y: -4 }}
                                    onClick={() => handleOpenSop(sop)}
                                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group cursor-pointer relative"
                                >
                                    <div className={cn("h-40 relative flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950")}>
                                        {sop.featureImage ? (
                                            <img src={sop.featureImage} alt={sop.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                        ) : null}
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                                            <PlayCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingSop(sop);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="p-2 bg-black/30 hover:bg-blue-500/80 text-white rounded-lg transition-colors"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteSop(sop.id);
                                                }}
                                                className="p-2 bg-black/30 hover:bg-red-500/80 text-white rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wider">
                                                {sop.category.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Eye className="w-3 h-3" /> {sop.views} views
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                                            {sop.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                                            <CheckSquare className="w-3 h-3 shrink-0" /> {sop.content.substring(0, 50)}...
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" /> Recent History
                        </h3>
                        <ActivityLog limit={6} category="UNIVERSITY" />
                    </div>
                </aside>
            </div>

            {/* Add SOP Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add New SOP</h2>
                                    <p className="text-slate-500 text-sm">Create a new procedure for the team.</p>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddSop} className="space-y-6">
                                <div className="grid gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">SOP Title</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g., How to handle client feedback"
                                        value={newSop.title}
                                        onChange={(e) => setNewSop({ ...newSop, title: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Category</label>
                                        <select
                                            value={newSop.category}
                                            onChange={(e) => setNewSop({ ...newSop, category: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            {categories.filter(c => c !== 'ALL').map(cat => (
                                                <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Video URL (Optional)</label>
                                        <input
                                            type="url"
                                            placeholder="YouTube/Loom link"
                                            value={newSop.videoUrl}
                                            onChange={(e) => setNewSop({ ...newSop, videoUrl: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Drive / Doc Link</label>
                                        <input
                                            type="url"
                                            placeholder="Google Drive/Doc link"
                                            value={newSop.docUrl}
                                            onChange={(e) => setNewSop({ ...newSop, docUrl: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Feature Image URL</label>
                                        <input
                                            type="url"
                                            placeholder="Image URL"
                                            value={newSop.featureImage}
                                            onChange={(e) => setNewSop({ ...newSop, featureImage: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Content / Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="Explain the procedure step by step..."
                                        value={newSop.content}
                                        onChange={(e) => setNewSop({ ...newSop, content: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 flex items-center gap-2"
                                    >
                                        {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create SOP'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit SOP Modal */}
            <AnimatePresence>
                {isEditModalOpen && editingSop && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit SOP</h2>
                                    <p className="text-slate-500 text-sm">Update the existing procedure.</p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleEditSop} className="space-y-6">
                                <div className="grid gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">SOP Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={editingSop.title}
                                        onChange={(e) => setEditingSop({ ...editingSop, title: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Category</label>
                                        <select
                                            value={editingSop.category}
                                            onChange={(e) => setEditingSop({ ...editingSop, category: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            {categories.filter(c => c !== 'ALL').map(cat => (
                                                <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Video URL (Optional)</label>
                                        <input
                                            type="url"
                                            value={editingSop.videoUrl || ''}
                                            onChange={(e) => setEditingSop({ ...editingSop, videoUrl: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Drive / Doc Link</label>
                                        <input
                                            type="url"
                                            value={editingSop.docUrl || ''}
                                            onChange={(e) => setEditingSop({ ...editingSop, docUrl: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Feature Image URL</label>
                                        <input
                                            type="url"
                                            value={editingSop.featureImage || ''}
                                            onChange={(e) => setEditingSop({ ...editingSop, featureImage: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Content / Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={editingSop.content}
                                        onChange={(e) => setEditingSop({ ...editingSop, content: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 flex items-center gap-2"
                                    >
                                        {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
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
