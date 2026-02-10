"use server"

import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"

export async function login(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { error: "Email and password are required" }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return { error: "Invalid credentials" }
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return { error: "Invalid credentials" }
        }

        const cookieStore = await cookies()
        cookieStore.set("auth", "true", { path: "/" }) // For middleware compatibility
        cookieStore.set("userId", user.id, { path: "/" })
        cookieStore.set("userRole", user.role, { path: "/" })

        // Update last login or similar if we had a field for it
    } catch (error) {
        console.error("Login error:", error)
        return { error: "Something went wrong" }
    }

    redirect("/dashboard")
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("auth")
    cookieStore.delete("userId")
    cookieStore.delete("userRole")
    redirect("/login")
}

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) return null

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                avatar: true,
                position: true
            }
        })
        return user
    } catch (error) {
        return null
    }
}
