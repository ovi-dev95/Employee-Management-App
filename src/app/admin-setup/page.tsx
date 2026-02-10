"use client"

import { useState } from "react"
import { runSeed } from "@/app/actions/seed-action"
import { Loader2, Database, CheckCircle, AlertCircle } from "lucide-react"

export default function AdminSetupPage() {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)

    const handleSeed = async () => {
        if (!confirm("WARNING: This will RESET the database and DELETE all existing data. Are you sure?")) {
            return
        }

        setLoading(true)
        setStatus(null)

        try {
            const result = await runSeed()
            setStatus(result)
        } catch (error) {
            setStatus({ success: false, message: "An unexpected error occurred." })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 text-center border-b border-slate-100 dark:border-slate-800">
                    <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                        <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Database Setup</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Reset and seed the database with initial users and data.
                        <br />
                        <span className="text-red-500 font-medium">Warning: This deletes all data!</span>
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    {status && (
                        <div className={`p-4 rounded-lg flex items-start gap-3 text-sm ${status.success
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                            {status.success ? (
                                <CheckCircle className="w-5 h-5 shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 shrink-0" />
                            )}
                            <p>{status.message}</p>
                        </div>
                    )}

                    <button
                        onClick={handleSeed}
                        disabled={loading}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Seeding Database...
                            </>
                        ) : (
                            "Reset & Seed Database"
                        )}
                    </button>

                    <div className="text-xs text-center text-slate-500 mt-4">
                        Default Password: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">password123</code>
                    </div>
                </div>
            </div>
        </div>
    )
}
