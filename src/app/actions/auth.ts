"use server"

import { prisma } from "@/lib/prisma"
import { hash, compare } from "bcryptjs"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function login(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user || !user.password) {
            return { error: "Invalid credentials" }
        }

        const isValid = await compare(password, user.password)

        if (!isValid) {
            return { error: "Invalid credentials" }
        }

        // Set session cookie
        const cookieStore = await cookies()
        cookieStore.set("userId", user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/"
        })

        redirect("/dashboard")
    } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error
        }
        console.error("Login error:", error)
        return { error: "Something went wrong" }
    }
}

export async function logout() {
    (await cookies()).delete("userId")
    redirect("/login")
}

export async function verifyInviteToken(token: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { inviteToken: token }
        })

        if (!user) {
            return { success: false, error: "Invalid token" }
        }

        if (user.inviteTokenExpiry && new Date() > user.inviteTokenExpiry) {
            return { success: false, error: "Token expired" }
        }

        return { success: true, email: user.email, name: user.name }

    } catch (error) {
        console.error("Verify token error:", error)
        return { success: false, error: "System error verifying token" }
    }
}

export async function setUserPassword(token: string, password: string) {
    try {
        const check = await verifyInviteToken(token)
        if (!check.success) return check

        const hashedPassword = await hash(password, 12)

        await prisma.user.update({
            where: { inviteToken: token },
            data: {
                password: hashedPassword,
                inviteToken: null,
                inviteTokenExpiry: null
            }
        })

        // Auto-login
        const user = await prisma.user.findUnique({ where: { inviteToken: token } }) // Note: token is null now, but we can't find by it. 
        // Logic correction: We need to find by email or ID from the verification step if we want to auto-login.
        // However, since we just updated the user and cleared the token, we can't find by token anymore.
        // Let's refactor to find user by email from the initial check.

        const userByEmail = await prisma.user.findUnique({ where: { email: check.email } })
        if (userByEmail) {
            (await cookies()).set("userId", userByEmail.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/"
            })
        }

        return { success: true, error: null }
    } catch (error) {
        console.error("Set password error:", error)
        return { success: false, error: "Failed to set password" }
    }
}
