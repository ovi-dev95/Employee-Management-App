"use client"

import { useState } from 'react'
import { AlertCircle, Palette, FileText, Send, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'

const requestTypes = [
    {
        id: 'bug',
        title: 'Bug Reporter',
        description: 'Something broken? Let us know so we can fix it.',
        icon: AlertCircle,
        color: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
    },
    {
        id: 'design',
        title: 'Design Request',
        description: 'Need visuals? Log a request for the UI/UX team.',
        icon: Palette,
        color: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
    },
    {
        id: 'content',
        title: 'Content Brief',
        description: 'Request new blog posts, copy, or SEO updates.',
        icon: FileText,
        color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
    },
]

const requestSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(10, 'Description must be detailed'),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
})

type RequestFormData = z.infer<typeof requestSchema>

export default function RequestsPage() {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const { register, handleSubmit, formState: { errors }, reset } = useForm<RequestFormData>({
        resolver: zodResolver(requestSchema),
    })

    const onSubmit = (data: RequestFormData) => {
        console.log('Submitted:', { ...data, type: selectedType })
        // Here we would call the API to save to DB
        setIsSubmitted(true)
        setTimeout(() => {
            setIsSubmitted(false)
            setSelectedType(null)
            reset()
        }, 2000)
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Submit a Request</h1>
                <p className="text-slate-500 dark:text-slate-400">Choose a category to get started. We'll route it to the right team.</p>
            </div>

            {!selectedType ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {requestTypes.map((type) => (
                        <motion.div
                            key={type.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedType(type.id)}
                            className={cn(
                                "p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-4",
                                type.color
                            )}
                        >
                            <div className="p-4 bg-white rounded-full shadow-sm">
                                <type.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">{type.title}</h3>
                                <p className="text-sm opacity-80 mt-1">{type.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 max-w-2xl mx-auto relative"
                >
                    <button
                        onClick={() => setSelectedType(null)}
                        className="absolute top-4 right-4 text-xs text-slate-400 hover:text-slate-600"
                    >
                        Cancel
                    </button>

                    <div className="mb-6 flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", requestTypes.find(t => t.id === selectedType)?.color)}>
                            {/* Icon rendering logic a bit hacky here but works */}
                            {(() => {
                                const Icon = requestTypes.find(t => t.id === selectedType)?.icon
                                return Icon ? <Icon className="w-6 h-6" /> : null
                            })()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                New {requestTypes.find(t => t.id === selectedType)?.title}
                            </h2>
                            <p className="text-sm text-slate-500">Fill in the details below.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                            <input
                                {...register('title')}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Brief summary of the request"
                            />
                            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                            <textarea
                                {...register('description')}
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Provide as much detail as possible..."
                            />
                            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                            <select
                                {...register('priority')}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="low">Low - When possible</option>
                                <option value="medium">Medium - Standard workflow</option>
                                <option value="high">High - Important deadline</option>
                                <option value="urgent">Urgent - Blocks production</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitted}
                            className={cn(
                                "w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all",
                                isSubmitted
                                    ? "bg-green-500 text-white"
                                    : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                            )}
                        >
                            {isSubmitted ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" /> Request Sent!
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
        </div>
    )
}
