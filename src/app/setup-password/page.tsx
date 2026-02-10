"use server"

import { verifyInviteToken, setUserPassword } from "@/app/actions/auth"
import { redirect } from "next/navigation"

export default async function SetupPasswordPage({
    searchParams,
}: {
    searchParams: { token?: string }
}) {
    const token = searchParams.token

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-2">Invalid Link</h1>
                    <p className="text-slate-500">This invitation link is missing a token. Please check the email you received.</p>
                </div>
            </div>
        )
    }

    const check = await verifyInviteToken(token)

    if (!check.success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-2">Link Expired or Invalid</h1>
                    <p className="text-slate-500">{check.error}</p>
                </div>
            </div>
        )
    }

    async function handleSubmit(formData: FormData) {
        "use server"
        const password = formData.get("password") as string
        const confirm = formData.get("confirm") as string
        const token = formData.get("token") as string

        if (password !== confirm) {
            return redirect(`/setup-password?token=${token}&error=Passwords do not match`)
        }

        if (password.length < 6) {
            return redirect(`/setup-password?token=${token}&error=Password must be at least 6 characters`)
        }

        const result = await setUserPassword(token, password)
        if (result.success) {
            redirect("/login?success=Password set successfully. Please login.")
        } else {
            redirect(`/setup-password?token=${token}&error=${result.error}`)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-700">
                <h1 className="text-3xl font-bold mb-2 text-center">Welcome, {check.name}!</h1>
                <p className="text-slate-500 text-center mb-8">Set up your password to activate your account.</p>

                <form action={handleSubmit} className="space-y-6">
                    <input type="hidden" name="token" value={token} />

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-slate-500">New Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Confirm Password</label>
                        <input
                            name="confirm"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20"
                    >
                        Set Password & Login
                    </button>
                </form>
            </div>
        </div>
    )
}
