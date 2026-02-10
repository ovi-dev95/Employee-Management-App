
import { prisma } from '@/lib/prisma'

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
    try {
        const settings = await prisma.systemSettings.findUnique({
            where: { id: "global" }
        })

        if (!settings) {
            return { success: false, error: "System settings not found" }
        }

        const fromEmail = settings.smtpFromEmail || settings.smtpUser || "noreply@razibmarketing.net"
        const fromName = "Razib Marketing Team"

        // 1. Check Provider
        if (settings.emailProvider === 'brevo') {
            return await sendViaBrevo({
                to,
                subject,
                html,
                apiKey: settings.brevoApiKey,
                senderEmail: fromEmail,
                senderName: fromName
            })
        }

        // 2. Default to SMTP (nodemailer)
        // We import dynamically to avoid build errors if nodemailer isn't installed in some environments
        try {
            const nodemailer = (await import('nodemailer')).default

            if (!settings.smtpHost || !settings.smtpUser || !settings.smtpPassword) {
                console.warn("SMTP settings not configured.")
                return { success: false, error: "SMTP settings missing" }
            }

            const transporter = nodemailer.createTransport({
                host: settings.smtpHost,
                port: settings.smtpPort || 587,
                secure: settings.smtpPort === 465,
                auth: {
                    user: settings.smtpUser,
                    pass: settings.smtpPassword,
                },
            })

            const info = await transporter.sendMail({
                from: `"${fromName}" <${fromEmail}>`,
                to,
                subject,
                html,
            })

            console.log("SMTP Email sent: %s", info.messageId)
            return { success: true, messageId: info.messageId }

        } catch (smtpError) {
            console.error("SMTP Error:", smtpError)
            return { success: false, error: "SMTP Failed. Check credentials or try Brevo." }
        }

    } catch (error) {
        console.error("Error sending email:", error)
        return { success: false, error: (error as Error).message }
    }
}

async function sendViaBrevo({
    to,
    subject,
    html,
    apiKey,
    senderEmail,
    senderName
}: {
    to: string,
    subject: string,
    html: string,
    apiKey?: string | null,
    senderEmail: string,
    senderName: string
}) {
    if (!apiKey) {
        return { success: false, error: "Brevo API Key missing" }
    }

    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: {
                    name: senderName,
                    email: senderEmail
                },
                to: [
                    {
                        email: to,
                        name: to // optional
                    }
                ],
                subject: subject,
                htmlContent: html
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error("Brevo API Error:", errorData)
            return { success: false, error: `Brevo Error: ${JSON.stringify(errorData)}` }
        }

        const data = await response.json()
        console.log("Brevo Email sent:", data)
        return { success: true, messageId: data.messageId }

    } catch (error) {
        console.error("Brevo Fetch Error:", error)
        return { success: false, error: "Failed to connect to Brevo API" }
    }
}
