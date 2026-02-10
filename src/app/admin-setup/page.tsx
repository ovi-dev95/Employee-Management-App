"use client"

import { useState } from "react"
import { runSeed } from "@/app/actions/seed-action"
import { debugLogin } from "@/app/actions/debug-auth"
import { Loader2, Database, CheckCircle, AlertCircle, Bug } from "lucide-react"

export default function AdminSetupPage() {
    // Seed State
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)

    // Debug Login State
    const [debugLoading, setDebugLoading] = useState(false)
    const [debugResult, setDebugResult] = useState<any>(null)

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

    const handleDebugLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setDebugLoading(true)
        setDebugResult(null)

        const formData = new FormData(e.currentTarget)
        try {
            const result = await debugLogin(formData)
            setDebugResult(result)
        } catch (error) {
            setDebugResult({ success: false, message: "Debug request failed" })
        } finally {
            setDebugLoading(false)
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

                    <div className="border-t border-slate-100 dark:border-slate-800 my-6 pt-6">
                        <div className="flex items-center justify-center gap-2 mb-4 text-slate-900 dark:text-white font-semibold">
                            <Bug className="w-5 h-5" />
                            <h3>Debug Login</h3>
                        </div>

                        <form onSubmit={handleDebugLogin} className="space-y-3">
                            <div>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                                />
                            </div>
                            <div>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={debugLoading}
                                className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                            >
                                {debugLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Test Credentials"}
                            </button>
                        </form>

                        {debugResult && (
                            <div className={`mt-4 p-3 rounded-lg text-xs font-mono whitespace-pre-wrap overflow-x-auto ${debugResult.success
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                                }`}>
                                {JSON.stringify(debugResult, null, 2)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
