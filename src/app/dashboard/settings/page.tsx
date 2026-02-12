"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Globe, Shield, Users, CreditCard, Bell, Database, Download, Trash2, Smartphone, TerminalSquare, Clock, BarChart3, CalendarDays, CheckCircle2, AlertCircle, Plus, X, Mail, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateSystemSettings, getSystemSettings, testEmailConfiguration } from '@/app/actions/settings'
import { getUsers, updateUser, deleteUser, createUser } from '@/app/actions/user'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general')
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [users, setUsers] = useState<any[]>([])
    const [settings, setSettings] = useState<any>({
        lookerStudioUrl: "",
        checkInTime: "12:00 PM",
        checkOutTime: "08:00 PM",
        sickLeaveDays: 10,
        paidLeaveDays: 15,
        yearlyLeaveDays: 20,
        yearlyLeaveDates: "Feb 14 - Eid, Mar 26 - Independence, Dec 25 - Xmas",
        smtpHost: "",
        smtpPort: 587,
        smtpUser: "",
        smtpPassword: "",
        smtpFromEmail: "",
        pointValues: { login: 1, idea: 10, request: 5, sop: 20 }
    })

    const fetchUsers = async () => {
        const usersData = await getUsers()
        if (usersData) setUsers(usersData)
    }

    const fetchSettings = async () => {
        const settingsData = await getSystemSettings()
        if (settingsData) {
            setSettings({
                ...settingsData,
                yearlyLeaveDates: settingsData.yearlyLeaveDates || "Feb 14 - Eid, Mar 26 - Independence, Dec 25 - Xmas",
                pointValues: settingsData.pointValues ? JSON.parse(settingsData.pointValues) : { login: 1, idea: 10, request: 5, sop: 20 }
            })
        }
    }

    useEffect(() => {
        fetchSettings()
        fetchUsers()
    }, [])

    const handleSave = async () => {
        setIsLoading(true)
        const result = await updateSystemSettings({
            lookerStudioUrl: settings.lookerStudioUrl,
            checkInTime: settings.checkInTime,
            checkOutTime: settings.checkOutTime,
            sickLeaveDays: parseInt(settings.sickLeaveDays),
            paidLeaveDays: parseInt(settings.paidLeaveDays),
            yearlyLeaveDays: parseInt(settings.yearlyLeaveDays),
            yearlyLeaveDates: settings.yearlyLeaveDates,
            smtpHost: settings.smtpHost,
            smtpPort: parseInt(settings.smtpPort),
            smtpUser: settings.smtpUser,
            smtpPassword: settings.smtpPassword,
            smtpFromEmail: settings.smtpFromEmail,
            emailProvider: settings.emailProvider,
            brevoApiKey: settings.brevoApiKey,
            pointValues: JSON.stringify(settings.pointValues)
        })

        setIsLoading(false)
        if (result.success) {
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } else {
            alert('Failed to save settings: ' + result.error)
        }
    }

    const updateField = (field: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [field]: value }))
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 relative">
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
                            <p className="font-bold">Settings Saved!</p>
                            <p className="text-sm opacity-90 text-white/90">Changes have been synced to the server.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your organization and platform preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-md shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save className="w-4 h-4 group-hover:scale-110 transition-transform" /> Save Changes
                        </>
                    )}
                </button>
            </header>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <nav className="w-full md:w-64 space-y-2">
                    <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={Globe}>General</TabButton>
                    <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={Users}>Team Members</TabButton>
                    <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Shield}>Security</TabButton>
                    <TabButton active={activeTab === 'email'} onClick={() => setActiveTab('email')} icon={Mail}>Email Settings</TabButton>
                    <TabButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={Bell}>Notifications</TabButton>
                    <TabButton active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} icon={CreditCard}>Billing</TabButton>
                    <TabButton active={activeTab === 'data'} onClick={() => setActiveTab('data')} icon={Database}>Data & Export</TabButton>
                    <TabButton active={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} icon={TerminalSquare}>Integrations</TabButton>
                    <TabButton active={activeTab === 'leave'} onClick={() => setActiveTab('leave')} icon={CalendarDays}>Leave Management</TabButton>
                    <TabButton active={activeTab === 'points'} onClick={() => setActiveTab('points')} icon={Trophy}>Gamification (Points)</TabButton>
                </nav>

                {/* Content Area */}
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 min-h-[500px] shadow-sm">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'general' && <GeneralSettings settings={settings} updateField={updateField} />}
                        {activeTab === 'members' && <MembersSettings users={users} onRefresh={fetchUsers} />}
                        {activeTab === 'security' && <SecuritySettings />}
                        {activeTab === 'email' && <EmailSettings settings={settings} updateField={updateField} />}
                        {activeTab === 'notifications' && <NotificationSettings />}
                        {activeTab === 'billing' && <BillingSettings />}
                        {activeTab === 'data' && <DataExportSettings />}
                        {activeTab === 'integrations' && <IntegrationSettings settings={settings} updateField={updateField} />}
                        {activeTab === 'leave' && <LeaveManagementSettings settings={settings} updateField={updateField} />}
                        {activeTab === 'points' && <PointsSettings settings={settings} updateField={updateField} />}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

function EmailSettings({ settings, updateField }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Email Configuration</h2>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 rounded-2xl mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                    Configure your email provider to enable invitations and notifications.
                </p>
            </div>

            <div className="grid gap-2 mb-6">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Provider</label>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => updateField('emailProvider', 'smtp')}
                        className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all", settings.emailProvider !== 'brevo' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400")}
                    >
                        SMTP
                    </button>
                    <button
                        onClick={() => updateField('emailProvider', 'brevo')}
                        className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all", settings.emailProvider === 'brevo' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400")}
                    >
                        Brevo (Sendinblue)
                    </button>
                </div>
            </div>

            {settings.emailProvider === 'brevo' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid gap-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Brevo API Key (v3)</label>
                        <input
                            type="password"
                            value={settings.brevoApiKey || ''}
                            onChange={(e) => updateField('brevoApiKey', e.target.value)}
                            placeholder="xkeysib-..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <p className="text-xs text-slate-500">Get your API key from <a href="https://app.brevo.com/settings/keys/api" target="_blank" className="text-blue-500 underline">Brevo Dashboard</a></p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sender Name</label>
                            <input
                                type="text"
                                value={settings.smtpUser || ''}
                                onChange={(e) => updateField('smtpUser', e.target.value)}
                                placeholder="My Company"
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sender Email</label>
                            <input
                                type="email"
                                value={settings.smtpFromEmail || ''}
                                onChange={(e) => updateField('smtpFromEmail', e.target.value)}
                                placeholder="noreply@company.com"
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid gap-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">SMTP Host</label>
                        <input
                            type="text"
                            value={settings.smtpHost || ''}
                            onChange={(e) => updateField('smtpHost', e.target.value)}
                            placeholder="smtp.gmail.com"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Port</label>
                            <input
                                type="number"
                                value={settings.smtpPort || ''}
                                onChange={(e) => updateField('smtpPort', parseInt(e.target.value))}
                                placeholder="587"
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">From Email</label>
                            <input
                                type="email"
                                value={settings.smtpFromEmail || ''}
                                onChange={(e) => updateField('smtpFromEmail', e.target.value)}
                                placeholder="noreply@company.com"
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">SMTP User</label>
                        <input
                            type="text"
                            value={settings.smtpUser || ''}
                            onChange={(e) => updateField('smtpUser', e.target.value)}
                            placeholder="user@example.com"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">SMTP Password</label>
                        <input
                            type="password"
                            value={settings.smtpPassword || ''}
                            onChange={(e) => updateField('smtpPassword', e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            )}

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <EmailTestButton />
            </div>

        </div>
    )
}

function TabButton({ active, onClick, icon: Icon, children }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left font-medium",
                active
                    ? "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
            )}
        >
            <Icon className={cn("w-5 h-5", active ? "text-blue-600 dark:text-blue-400" : "text-slate-400")} />
            {children}
        </button>
    )
}

function GeneralSettings({ settings, updateField }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">General Information</h2>

            <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Organization Name</label>
                <input
                    type="text"
                    defaultValue="Razib Marketing"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Support Email</label>
                <input
                    type="email"
                    defaultValue="support@razibmarketing.net"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Timezone</label>
                <select
                    defaultValue="Dhaka (GMT+6)"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option>Pacific Time (PT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>GMT</option>
                    <option>Dhaka (GMT+6)</option>
                </select>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" /> Attendance Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Standard Check-In Time</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={settings.checkInTime}
                                onChange={(e) => updateField('checkInTime', e.target.value)}
                                placeholder="12:00 PM"
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Standard Check-Out Time</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={settings.checkOutTime}
                                onChange={(e) => updateField('checkOutTime', e.target.value)}
                                placeholder="08:00 PM"
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MembersSettings({ users, onRefresh }: { users: any[], onRefresh: () => void }) {
    const [editingUser, setEditingUser] = useState<any>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [isInviting, setIsInviting] = useState(false)
    const [inviteData, setInviteData] = useState({
        name: '',
        email: '',
        role: 'SUBSCRIBER',
        department: 'WEB'
    })

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await updateUser(editingUser.id, {
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role,
            department: editingUser.department
        })
        if (result.success) {
            setEditingUser(null)
            onRefresh()
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to remove this team member?')) {
            setIsDeleting(id)
            const result = await deleteUser(id)
            if (result.success) {
                onRefresh()
            }
            setIsDeleting(null)
        }
    }

    const handleInvite = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            console.log("handleInvite: Submitting invite for", inviteData.email);
            setIsInviting(true)
            const result = await createUser(inviteData)
            console.log("handleInvite: Create user result", result);
            if (result.success) {
                if (result.warning) {
                    alert('User created, but email failed to send: ' + result.warning);
                }
                console.log("handleInvite: Success! Refreshing list.");
                setIsInviteModalOpen(false)
                setInviteData({ name: '', email: '', role: 'SUBSCRIBER', department: 'WEB' })
                await onRefresh()
            } else {
                console.error("handleInvite: Failed", result.error);
                alert('Failed to invite member: ' + result.error)
            }
        } catch (error) {
            console.error("handleInvite: Unexpected error", error);
            alert('An unexpected error occurred while inviting the member.')
        } finally {
            setIsInviting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Team Members</h2>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="text-sm bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-colors"
                >
                    Invite Member
                </button>
            </div>

            <div className="space-y-4">
                {users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/30 dark:bg-slate-900/10">
                        <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
                        <p className="text-slate-500 font-medium">No team members found</p>
                        <p className="text-xs text-slate-400 mt-1">Invite your team to get started</p>
                    </div>
                ) : (
                    users.map((member, i) => {
                        return (
                            <div key={member.id} className="flex flex-col p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                                            {member.name?.[0] || '?'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                                            <p className="text-xs text-slate-500">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                                            {member.role}
                                        </span>
                                        <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setEditingUser(member)}
                                                className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                            >
                                                <TerminalSquare className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                disabled={isDeleting === member.id}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* ... existing editing form ... */}
                                {editingUser?.id === member.id && (
                                    <motion.form
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4"
                                        onSubmit={handleUpdate}
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={editingUser.name}
                                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={editingUser.email}
                                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</label>
                                                <select
                                                    value={editingUser.role}
                                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                >
                                                    <option value="ADMIN">ADMIN</option>
                                                    <option value="EDITOR">EDITOR</option>
                                                    <option value="SUBSCRIBER">SUBSCRIBER</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Department</label>
                                                <select
                                                    value={editingUser.department}
                                                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                                                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                >
                                                    <option value="WEB">WEB</option>
                                                    <option value="UI_UX">UI/UX</option>
                                                    <option value="SEO">SEO</option>
                                                    <option value="PAID_MEDIA">PAID MEDIA</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setEditingUser(null)}
                                                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                                            >
                                                Save Member
                                            </button>
                                        </div>
                                    </motion.form>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {isInviteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsInviteModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Invite Team Member</h2>
                                    <p className="text-slate-500 text-sm">Add a new member to your organization.</p>
                                </div>
                                <button
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleInvite} className="space-y-6">
                                <div className="grid gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="John Doe"
                                        value={inviteData.name}
                                        onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="john@company.com"
                                        value={inviteData.email}
                                        onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Role</label>
                                        <select
                                            value={inviteData.role}
                                            onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="EDITOR">EDITOR</option>
                                            <option value="SUBSCRIBER">SUBSCRIBER</option>
                                        </select>
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Department</label>
                                        <select
                                            value={inviteData.department}
                                            onChange={(e) => setInviteData({ ...inviteData, department: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            <option value="WEB">WEB</option>
                                            <option value="UI_UX">UI/UX</option>
                                            <option value="SEO">SEO</option>
                                            <option value="PAID_MEDIA">PAID MEDIA</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsInviteModalOpen(false)}
                                        className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isInviting}
                                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 flex items-center gap-2"
                                    >
                                        {isInviting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Invite Member'}
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

function SecuritySettings() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Security & Access</h2>

            <div className="p-5 border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600">
                    <Shield className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-amber-800 dark:text-amber-400 font-bold mb-1 uppercase text-xs tracking-wider">Two-Factor Authentication</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-500">We highly recommend enabling 2FA for all administrator accounts to prevent unauthorized access.</p>
                    <button className="mt-3 text-sm font-bold text-amber-900 dark:text-amber-300 hover:underline">Enable 2FA Now →</button>
                </div>
            </div>

            <div className="grid gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between uppercase tracking-wider">
                    <span>Password Policy</span>
                    <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
                </label>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" /> Minimum 8 characters</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" /> At least one numeric character</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" /> At least one special symbol (@, #, $)</div>
                </div>
            </div>
        </div>
    )
}

function NotificationSettings() {
    return (
        <div className="space-y-6 text-slate-900 dark:text-white">
            <h2 className="text-xl font-bold mb-6">Platform Notifications</h2>
            <div className="space-y-4">
                {[
                    { title: "Email Notifications", desc: "Receive updates on requests and team activity." },
                    { title: "Browser Push Notifications", desc: "Real-time alerts for punch-in reminders." },
                    { title: "Weekly Digest", desc: "Get a summary of your team's performance." },
                    { title: "Task Reminders", desc: "Deadlines and scheduled meeting alerts." }
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 transition-colors">
                        <div>
                            <p className="font-bold text-sm tracking-tight">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    )
}

function BillingSettings() {
    const [cards, setCards] = useState([
        { id: '1', brand: 'Visa', last4: '4242', exp: '12/28', isPrimary: true }
    ])
    const [isAddCardOpen, setIsAddCardOpen] = useState(false)
    const [newCard, setNewCard] = useState({ number: '', exp: '', cvc: '' })

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock validation
        if (newCard.number.length < 16) return

        setCards([...cards, {
            id: Date.now().toString(),
            brand: 'MasterCard', // Mock
            last4: newCard.number.slice(-4),
            exp: newCard.exp,
            isPrimary: cards.length === 0
        }])
        setIsAddCardOpen(false)
        setNewCard({ number: '', exp: '', cvc: '' })
    }

    const removeCard = (id: string) => {
        if (confirm('Remove this payment method?')) {
            setCards(cards.filter(c => c.id !== id))
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Billing & Plan</h2>
            <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-2xl shadow-blue-500/20 overflow-hidden relative">
                <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-1">RM Enterprise Plan</h3>
                    <p className="opacity-80 text-sm mb-6 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Active until Dec 31, 2026
                    </p>
                    <button className="px-6 py-2.5 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors">Manage Subscription</button>
                </div>
                <CreditCard className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
            </div>

            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-widest">Payment Methods</h3>
                    <button
                        onClick={() => setIsAddCardOpen(true)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                        <Plus className="w-3 h-3" /> Add Method
                    </button>
                </div>

                <div className="space-y-3">
                    {cards.map(card => (
                        <div key={card.id} className="flex items-center gap-4 p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl group">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-slate-500" />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 dark:text-white">{card.brand} ending in {card.last4}</p>
                                <p className="text-xs text-slate-500 font-medium">Expires {card.exp} {card.isPrimary && '• Primary'}</p>
                            </div>
                            <button
                                onClick={() => removeCard(card.id)}
                                className="ml-auto p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {cards.length === 0 && (
                        <p className="text-sm text-slate-500 italic">No payment methods added.</p>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isAddCardOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddCardOpen(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl"
                        >
                            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Add Card</h3>
                            <form onSubmit={handleAddCard} className="space-y-4">
                                <input
                                    required
                                    placeholder="Card Number"
                                    maxLength={19}
                                    value={newCard.number}
                                    onChange={e => setNewCard({ ...newCard, number: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        required
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        value={newCard.exp}
                                        onChange={e => setNewCard({ ...newCard, exp: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none"
                                    />
                                    <input
                                        required
                                        placeholder="CVC"
                                        maxLength={3}
                                        value={newCard.cvc}
                                        onChange={e => setNewCard({ ...newCard, cvc: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none"
                                    />
                                </div>
                                <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold">Add Card</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function DataExportSettings() {
    const handleExport = () => {
        const dummyData = {
            users: [
                { id: '1', name: 'John Doe', role: 'ADMIN' },
                { id: '2', name: 'Jane Smith', role: 'EDITOR' }
            ],
            attendance: [
                { id: '101', date: '2023-10-01', status: 'PRESENT' }
            ],
            settings: {
                orgName: 'MNC'
            },
            timestamp: new Date().toISOString()
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dummyData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "organization_backup_" + new Date().toISOString().split('T')[0] + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Data Management</h2>
            <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Export Full Organization Data</h3>
                        <p className="text-xs text-slate-500">Includes attendance records, employee profiles, and system logs.</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-white transition-all shadow-md"
                    >
                        <Download className="w-4 h-4" /> Export (.json)
                    </button>
                </div>
            </div>
            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
                <h3 className="text-red-600 dark:text-red-400 font-bold mb-1 uppercase text-xs tracking-widest">Danger Zone</h3>
                <p className="text-sm text-slate-500 mt-2 mb-4 italic">Permanently remove this workspace and all associated employee data. This action is irreversible.</p>
                <button
                    onClick={() => alert("This feature is disabled for safety reasons.")}
                    className="flex items-center gap-2 text-xs font-black text-red-600 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 px-5 py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                    <Trash2 className="w-4 h-4" /> Delete Organization Workspace
                </button>
            </div>
        </div>
    )
}

function IntegrationSettings({ settings, updateField }: any) {
    const [uploadStatus, setUploadStatus] = useState('')

    const handleZKTecoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setUploadStatus('Uploading...')
            // Mock upload process
            setTimeout(() => {
                setUploadStatus('File uploaded successfully! Processing in background.')
            }, 1500)
        }
    }

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Connected Integrations</h2>

            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 group overflow-hidden relative">
                <div className="flex items-start gap-6 relative z-10">
                    <div className="p-4 bg-blue-500/10 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                        <Smartphone className="w-10 h-10" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">RM Biometric Punch Machine</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed max-w-lg mb-4">Connect your physical attendance hardware. Supports ZKTeco, Hikvision, and Anviz devices via the cloud API.</p>

                        <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
                            <h4 className="font-bold text-sm mb-2">Upload Data Manually via USB</h4>
                            <p className="text-xs text-slate-500 mb-3">If the cloud connection is unstable, you can upload the .dat or .xml file exported from your device.</p>
                            <input
                                type="file"
                                accept=".dat,.xml,.csv,.txt"
                                onChange={handleZKTecoUpload}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {uploadStatus && <p className="text-xs text-emerald-500 font-bold mt-2">{uploadStatus}</p>}
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Device IP / Endpoint</label>
                                <input type="text" placeholder="192.168.1.201" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Port</label>
                                <input type="text" placeholder="4370" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all" />
                            </div>
                        </div>
                        <button className="mt-6 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all active:scale-95">
                            Check Cloud Connection
                        </button>
                    </div>
                </div>
                <TerminalSquare className="absolute -bottom-10 -right-10 w-48 h-48 text-slate-900/[0.03] dark:text-white/[0.03] -rotate-12" />
            </div>

            <div className="mt-4 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-3xl border border-blue-100 dark:border-blue-800 shadow-sm relative overflow-hidden">
                <div className="flex items-start gap-6 relative z-10">
                    <div className="p-4 bg-white dark:bg-slate-900 text-blue-600 rounded-2xl shadow-lg shadow-blue-500/10">
                        <BarChart3 className="w-10 h-10" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Looker Studio Integration</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">Embed your advanced Google Data Studio reports directly into the dashboard.</p>

                        <div className="mt-6">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Embed URL (Report ID)</label>
                            <input
                                type="text"
                                value={settings.lookerStudioUrl}
                                onChange={(e) => updateField('lookerStudioUrl', e.target.value)}
                                placeholder="https://lookerstudio.google.com/embed/reporting/..."
                                className="w-full px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-950 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LeaveManagementSettings({ settings, updateField }: any) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [newHoliday, setNewHoliday] = useState('')

    const handleAddHoliday = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newHoliday.trim()) return

        const currentHolidays = settings.yearlyLeaveDates ? settings.yearlyLeaveDates.split(',').map((h: string) => h.trim()).filter(Boolean) : []
        const updatedHolidays = [...currentHolidays, newHoliday.trim()].join(', ')
        updateField('yearlyLeaveDates', updatedHolidays)
        setNewHoliday('')
        setIsAddModalOpen(false)
    }

    const handleDeleteHoliday = (indexToRemove: number) => {
        const currentHolidays = settings.yearlyLeaveDates ? settings.yearlyLeaveDates.split(',').map((h: string) => h.trim()).filter(Boolean) : []
        const updatedHolidays = currentHolidays.filter((_: string, i: number) => i !== indexToRemove).join(', ')
        updateField('yearlyLeaveDates', updatedHolidays)
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Leave Policy</h2>
                    <p className="text-sm text-slate-500">Configure global leave days and balance for all employees.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <LeaveInput
                    title="Sick Leave Days"
                    value={settings.sickLeaveDays}
                    onChange={(val: any) => updateField('sickLeaveDays', val)}
                    icon={CreditCard}
                    color="text-emerald-500"
                />
                <LeaveInput
                    title="Paid Leave Days"
                    value={settings.paidLeaveDays}
                    onChange={(val: any) => updateField('paidLeaveDays', val)}
                    icon={CreditCard}
                    color="text-blue-500"
                />
                <LeaveInput
                    title="Yearly Leave Days"
                    value={settings.yearlyLeaveDays}
                    onChange={(val: any) => updateField('yearlyLeaveDays', val)}
                    icon={CalendarDays}
                    color="text-indigo-500"
                />
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
                    <CalendarDays className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-bold">Yearly Organization Holidays</h3>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="flex flex-wrap gap-3 mb-6">
                        {(settings.yearlyLeaveDates || "").split(',').filter(Boolean).map((date: string, i: number) => (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={i}
                                className="px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-3 shadow-sm hover:border-indigo-300 transition-colors"
                            >
                                {date.trim()}
                                <button
                                    onClick={() => handleDeleteHoliday(i)}
                                    className="text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </motion.span>
                        ))}
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                        >
                            + Add Custom Date
                        </button>
                    </div>
                    <div className="flex items-start gap-2 text-slate-500">
                        <AlertCircle className="w-4 h-4 mt-0.5" />
                        <p className="text-[11px] font-medium max-w-sm">Changes here will automatically update the company-wide holiday calendar and deduction algorithms.</p>
                    </div>
                </div>
            </div>

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
                            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6"
                        >
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Holiday</h3>
                            <form onSubmit={handleAddHoliday} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Holiday Name & Date</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="e.g. Dec 25 - Christmas"
                                        value={newHoliday}
                                        onChange={(e) => setNewHoliday(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newHoliday.trim()}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                    >
                                        Add Holiday
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

function LeaveInput({ title, value, onChange, icon: Icon, color }: any) {
    return (
        <div className="p-6 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80 group shadow-sm hover:shadow-md">
            <div className="flex items-center gap-2 mb-4">
                <div className={cn("p-1.5 rounded-lg bg-opacity-10", color.replace('text', 'bg'))}>
                    <Icon className={cn("w-4 h-4", color)} />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{title}</span>
            </div>
            <div className="relative flex items-end">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full text-5xl font-black bg-transparent border-none text-slate-900 dark:text-white outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pt-2"
                />
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 flex items-center gap-1.5 text-indigo-500 bg-indigo-500/5 px-2 py-1 rounded-lg">
                    <span className="text-[9px] font-black uppercase tracking-widest">Edit</span>
                </div>
            </div>
        </div>
    )
}

function PointsSettings({ settings, updateField }: any) {
    const updatePoint = (key: string, val: number) => {
        updateField('pointValues', { ...settings.pointValues, [key]: val })
    }

    const keys = ['login', 'idea', 'request', 'sop', 'checkIn', 'checkOut']

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Gamification & Points</h2>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900 rounded-2xl mb-6">
                <p className="text-sm text-purple-800 dark:text-purple-300">
                    Define how many points employees earn for specific activities. This fuels the leaderboard and rewards system.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(settings.pointValues || {}).concat(keys.filter(k => !settings.pointValues?.[k])).map((key) => {
                    if (key === 'undefined') return null;
                    return (
                        <div key={key} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="font-bold text-slate-700 dark:text-slate-300 capitalize">{key.replace('_', ' ')}</p>
                                <p className="text-xs text-slate-400">Points per action</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={settings.pointValues?.[key] || 0}
                                    onChange={(e) => updatePoint(key, parseInt(e.target.value))}
                                    className="w-20 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-right outline-none focus:border-blue-500"
                                />
                                <Trophy className="w-4 h-4 text-amber-500" />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function EmailTestButton({ settings, updateField }: any) {
    const [testEmail, setTestEmail] = useState('')
    const [isTesting, setIsTesting] = useState(false)
    const [testResult, setResult] = useState<any>(null)

    const handleTest = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!testEmail) return

        setIsTesting(true)
        setResult(null)
        try {
            const result = await testEmailConfiguration(testEmail)
            setResult(result)
        } catch (error) {
            setResult({ success: false, error: 'Network error occurred' })
        } finally {
            setIsTesting(false)
        }
    }

    return (
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" /> Test Email Configuration
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Send a test email to verify your settings are working correctly.
            </p>

            <div className="flex gap-2">
                <input
                    type="email"
                    placeholder="Enter recipient email"
                    value={testEmail}
                    onChange={e => setTestEmail(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
                <button
                    onClick={handleTest}
                    disabled={isTesting || !testEmail}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-sm font-bold whitespace-nowrap disabled:opacity-50"
                >
                    {isTesting ? 'Sending...' : 'Send Test'}
                </button>
            </div>

            {testResult && (
                <div className={cn(
                    "p-3 rounded-lg text-sm border flex items-start gap-2",
                    testResult.success
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/30"
                        : "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/10 dark:border-red-900/30"
                )}>
                    {testResult.success ? (
                        <>
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <div>
                                <p className="font-bold">Email Sent Successfully!</p>
                                <p className="text-xs opacity-90">Please check your inbox (and spam folder).</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <div>
                                <p className="font-bold">Failed to Send</p>
                                <p className="text-xs opacity-90">{testResult.error}</p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
