"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Lock, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { ModeToggle } from '@/components/mode-toggle'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError('')

        const result = await login(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
        // Redirect is handled by the server action on success
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 pointer-events-none" />

            <div className="absolute top-4 right-4 z-50">
                <ModeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-8 z-10"
            >
                <div className="text-center mb-8">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <Image
                            src="/logo.png"
                            alt="Nexus Logo"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                        Welcome Back
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Enter credentials to access NEXUS Intranet.</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium text-center border border-red-200 dark:border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                            <input
                                name="email"
                                type="email"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                            <input
                                name="password"
                                type="password"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Sign In to Dashboard"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
                    <p className="text-xs text-slate-400">
                        Protected System. Authorized Personnel Only. <br />
                        &copy; {new Date().getFullYear()} Razib Marketing.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

