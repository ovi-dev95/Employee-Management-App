"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function debugLogin(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log(`[DEBUG] Attempting login debug for: ${email}`)

    try {
        // 1. Check User Existence
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return {
                success: false,
                step: "User Lookup",
                message: `User with email '${email}' NOT FOUND in database.`,
                details: { email }
            }
        }

        // 2. Check Password Hash Structure
        const isHash = user.password.startsWith("$2b$") || user.password.startsWith("$2a$")
        const passwordPrefix = user.password.substring(0, 10) + "..."

        // 3. Verify Password
        let isValid = false
        try {
            isValid = await bcrypt.compare(password, user.password)
        } catch (bcryptError) {
            return {
                success: false,
                step: "Bcrypt Comparison",
                message: "Error running bcrypt.compare",
                details: {
                    error: (bcryptError as Error).message,
                    storedHashPrefix: passwordPrefix
                }
            }
        }

        if (isValid) {
            return {
                success: true,
                step: "Success",
                message: "Login Successful! Credentials are correct.",
                details: {
                    userId: user.id,
                    role: user.role,
                    storedHashPrefix: passwordPrefix
                }
            }
        } else {
            return {
                success: false,
                step: "Password Verification",
                message: "Password Mismatch. The password you entered does not match the stored hash.",
                details: {
                    storedHashLooksLikeBcrypt: isHash,
                    storedHashPrefix: passwordPrefix,
                    providedPasswordLength: password.length
                }
            }
        }

    } catch (error) {
        return {
            success: false,
            step: "System Error",
            message: "An unexpected error occurred during debug.",
            details: { error: (error as Error).message }
        }
    }
}
