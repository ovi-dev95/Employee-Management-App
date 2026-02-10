"use client"

import { useState } from "react"
import { runSeed } from "@/app/actions/seed-action"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                        <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle>Database Setup</CardTitle>
                    <CardDescription>
                        Reset and seed the database with initial users and data.
                        <br />
                        <span className="text-red-500 font-medium">Warning: This deletes all data!</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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

                    <Button
                        onClick={handleSeed}
                        disabled={loading}
                        className="w-full"
                        size="lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Seeding Database...
                            </>
                        ) : (
                            "Reset & Seed Database"
                        )}
                    </Button>

                    <div className="text-xs text-center text-slate-500 mt-4">
                        Default Password: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">password123</code>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
