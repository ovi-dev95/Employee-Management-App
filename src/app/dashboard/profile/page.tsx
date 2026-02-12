"use client"

import { useState, useEffect } from 'react'
import { User2, Calendar, Mail, Building, LogOut, Award, Briefcase, Camera, Settings, Bell, Shield, PenSquare, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getCurrentUser, updateUser, updatePassword } from '@/app/actions/user'
import { logout } from '@/app/actions/auth'

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('overview')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [user, setUser] = useState<any>(null)

    const fetchUser = async () => {
        try {
            setIsLoading(true)
            const data = await getCurrentUser()
            if (data) {
                setUser(data)
            } else {
                console.error("fetchUser: No user data returned")
                setUser(null)
            }
        } catch (error) {
            console.error("fetchUser: Error fetching user", error)
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const handleFileUpload = async (type: 'avatar' | 'cover') => {
        if (!user) return
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = async (e: any) => {
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.onloadend = async () => {
                    const base64String = reader.result as string
                    const result = await updateUser(user.id, { [type]: base64String })
                    if (result.success) {
                        setUser(result.user)
                        setShowSuccess(true)
                        setTimeout(() => setShowSuccess(false), 3000)
                    }
                }
                reader.readAsDataURL(file)
            }
        }
        input.click()
    }

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setIsSaving(true)
        const result = await updateUser(user.id, {
            name: user.name,
            position: user.position,
            department: user.department
        })
        setIsSaving(false)
        if (result.success) {
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        }
    }

    const handleSignOut = async () => {
        await logout()
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">Loading your profile...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto mt-20">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Could not load profile</h2>
                <p className="text-slate-500 mb-6">There was an issue fetching your account data. Please try again or contact support.</p>
                <button
                    onClick={fetchUser}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                >
                    Retry Loading
                </button>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto relative">
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-8 right-8 z-50 flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-500/20"
                    >
                        <CheckCircle2 className="w-6 h-6" />
                        <div>
                            <p className="font-bold">Profile Updated!</p>
                            <p className="text-sm opacity-90 text-white/90">Your changes have been saved.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Profile</h1>
                <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
                {/* Cover Image */}
                <div className="h-48 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative group">
                    {user.cover ? (
                        <img src={user.cover} alt="Cover" className="w-full h-full object-cover" />
                    ) : null}

                    <button
                        onClick={() => handleFileUpload('cover')}
                        className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                        title="Change Cover"
                    >
                        <Camera className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile Info Header */}
                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl font-bold text-slate-400 overflow-hidden shadow-lg">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    (user.name || '?').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                                )}
                            </div>
                            <button
                                onClick={() => handleFileUpload('avatar')}
                                className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all"
                                title="Change Avatar"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Details */}
                        <div className="flex-1 pt-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> {user.position || "Member"}
                            </p>
                        </div>

                        {/* Stats Badges */}
                        <div className="flex gap-3 mt-4 md:mt-0">
                            <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-xl border border-yellow-200 dark:border-yellow-800 flex items-center gap-2 font-bold text-sm">
                                <Award className="w-4 h-4" /> {user.points} XP
                            </div>
                            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-800 font-bold text-sm uppercase tracking-wide">
                                {user.role}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800">
                        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={User2}>Overview</TabButton>
                        <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings}>Settings</TabButton>
                        <TabButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={Bell}>Notifications</TabButton>
                        <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Shield}>Security</TabButton>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-8">
                        {activeTab === 'overview' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
                                        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Building className="w-4 h-4 text-slate-500" /> Contact Information
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                                                <span className="text-slate-500">Email</span>
                                                <span className="font-medium text-slate-900 dark:text-white">{user.email}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                                                <span className="text-slate-500">Department</span>
                                                <span className="font-medium text-slate-900 dark:text-white">{user.department}</span>
                                            </div>
                                            <div className="flex justify-between py-2">
                                                <span className="text-slate-500">Location</span>
                                                <span className="font-medium text-slate-900 dark:text-white">Remote (Dhaka)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <StatsBlock title="Requests Submitted" value="12" icon={Calendar} color="text-emerald-500 bg-emerald-500/10" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800">
                                        {user.activities && user.activities.length > 0 ? (
                                            user.activities.map((activity: any) => (
                                                <ActivityItem
                                                    key={activity.id}
                                                    action={activity.action}
                                                    target={activity.category || 'General'}
                                                    date={new Date(activity.createdAt).toLocaleDateString()}
                                                    points={activity.points > 0 ? `+${activity.points}` : activity.points}
                                                />
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-slate-500">No recent activity</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <form onSubmit={handleSaveProfile} className="max-w-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Settings</h3>

                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Display Name</label>
                                        <input
                                            type="text"
                                            value={user.name}
                                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Job Title</label>
                                        <input
                                            type="text"
                                            value={user.position || ''}
                                            onChange={(e) => setUser({ ...user, position: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Department</label>
                                        <select
                                            value={user.department}
                                            onChange={(e) => setUser({ ...user, department: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="WEB">WEB</option>
                                            <option value="UI_UX">UI/UX</option>
                                            <option value="SEO">SEO</option>
                                            <option value="PAID_MEDIA">PAID MEDIA</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-6 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="max-w-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-blue-500" /> Notification Preferences
                                </h3>
                                <div className="space-y-4">
                                    <NotificationToggle
                                        title="Email Notifications"
                                        description="Receive updates about your requests and team activity via email."
                                        defaultChecked={true}
                                    />
                                    <NotificationToggle
                                        title="System Push Notifications"
                                        description="Real-time alerts in your browser for punch-in reminders."
                                        defaultChecked={true}
                                    />
                                    <NotificationToggle
                                        title="Weekly Performance Summary"
                                        description="A weekly digest of your points and attendance stats."
                                        defaultChecked={false}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="max-w-xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-emerald-500" /> Security Settings
                                </h3>

                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                                    <form onSubmit={async (e) => {
                                        e.preventDefault()
                                        const form = e.target as HTMLFormElement
                                        const current = (form.elements.namedItem('currentPassword') as HTMLInputElement).value
                                        const next = (form.elements.namedItem('newPassword') as HTMLInputElement).value

                                        if (!current || !next) return

                                        setIsSaving(true)
                                        const result = await updatePassword(user.id, current, next)
                                        setIsSaving(false)

                                        if (result.success) {
                                            setShowSuccess(true)
                                            setTimeout(() => setShowSuccess(false), 3000)
                                            form.reset()
                                        } else {
                                            alert("Failed: " + result.error)
                                        }
                                    }} className="space-y-4">
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
                                            <input name="currentPassword" type="password" placeholder="••••••••" required className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                                            <input name="newPassword" type="password" placeholder="••••••••" required className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                                        </div>
                                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-sm font-bold disabled:opacity-50">
                                            {isSaving ? "Updating..." : "Update Password"}
                                        </button>
                                    </form>

                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h4>
                                            <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                                        </div>
                                        <button className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-800">Enable</button>
                                    </div>
                                </div>

                                <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 rounded-xl space-y-2">
                                    <h4 className="font-bold text-red-800 dark:text-red-400">Advanced: Logout from all devices</h4>
                                    <p className="text-xs text-red-700 dark:text-red-500">This will terminate all active sessions including this one.</p>
                                    <button className="text-xs font-bold text-red-600 underline">Logout Everything</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

function TabButton({ active, onClick, icon: Icon, children }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "pb-4 px-2 text-sm font-medium border-b-2 transition-all flex items-center gap-2",
                active
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
        >
            <Icon className="w-4 h-4" />
            {children}
        </button>
    )
}

function StatsBlock({ title, value, icon: Icon, color }: any) {
    return (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">{title}</p>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</h3>
            </div>
            <div className={cn("p-4 rounded-2xl", color)}>
                <Icon className="w-8 h-8" />
            </div>
        </div>
    )
}

function ActivityItem({ action, target, date, points }: any) {
    return (
        <div className="flex items-center justify-between p-4 hover:bg-white dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                    <Calendar className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{action}: <span className="font-normal text-slate-500">{target}</span></p>
                    <p className="text-xs text-slate-400 mt-0.5">{date}</p>
                </div>
            </div>
            <span className="font-bold text-green-600 text-xs">
                {points}
            </span>
        </div>
    )
}

function NotificationToggle({ title, description, defaultChecked }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h4>
                <p className="text-xs text-slate-500 max-w-xs">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    )
}
