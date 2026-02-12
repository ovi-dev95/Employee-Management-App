import nodemailer from 'nodemailer';
import { prisma } from "@/lib/prisma"
import { Resend } from 'resend';

type EmailOptions = {
    to: string;
    subject: string;
    text?: string;
    html?: string;
};

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
    try {
        const settings = await prisma.systemSettings.findUnique({
            where: { id: "global" }
        });

        if (!settings) {
            console.error("sendEmail: System settings not found, cannot send email.");
            return { success: false, error: "Settings not configured" };
        }

        const fromEmail = settings.smtpFromEmail || 'noreply@razibmarketing.com';
        const senderName = settings.smtpUser || 'Razib Marketing';

        if (settings.emailProvider === 'brevo') {
            if (!settings.brevoApiKey) {
                console.error("sendEmail: Brevo selected but API key is missing");
                return { success: false, error: "Brevo API Key is missing" };
            }
            console.log("sendEmail: Using Brevo API v3");

            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': settings.brevoApiKey,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    sender: {
                        name: senderName,
                        email: fromEmail
                    },
                    to: [{
                        email: to
                    }],
                    subject: subject,
                    htmlContent: html || text // Brevo requires htmlContent for HTML emails
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("sendEmail: Brevo API Error", errorData);

                let errorMessage = `Brevo Error: ${errorData.message || response.statusText}`;
                if (errorMessage.includes("unrecognized IP address")) {
                    errorMessage += " (Action Required: Disable IP restrictions in your Brevo API Key settings)";
                }

                return { success: false, error: errorMessage };
            }

            const data = await response.json();
            console.log("sendEmail: Brevo Success", data);
            return { success: true };

        } else if (settings.emailProvider === 'resend' || ((settings as any).resendApiKey && !settings.emailProvider) || process.env.RESEND_API_KEY) {
            const resendApiKey = (settings as any).resendApiKey || process.env.RESEND_API_KEY;

            if (!resendApiKey) {
                console.error("sendEmail: Resend selected but API key is missing");
                return { success: false, error: "Resend API Key is missing" };
            }
            console.log("sendEmail: Using Resend API");

            const resend = new Resend(resendApiKey);

            const { data, error } = await resend.emails.send({
                from: `${senderName} <${fromEmail}>`, // Resend requires a verified domain or uses their testing domain
                to: [to],
                subject: subject,
                html: html || text || '',
                text: text || '',
            });

            if (error) {
                console.error("sendEmail: Resend Error", error);
                return { success: false, error: error.message };
            }

            console.log("sendEmail: Resend Success", data);
            return { success: true };

        } else if (settings.emailProvider === 'smtp' || !settings.emailProvider) { // Default to SMTP if not set
            console.log("sendEmail: Using SMTP");

            if (!settings.smtpHost || !settings.smtpUser || !settings.smtpPassword) {
                console.error("sendEmail: SMTP credentials missing");
                return { success: false, error: "SMTP credentials missing" };
            }

            const transporter = nodemailer.createTransport({
                host: settings.smtpHost,
                port: settings.smtpPort || 587,
                secure: settings.smtpPort === 465, // true for 465, false for other ports
                auth: {
                    user: settings.smtpUser,
                    pass: settings.smtpPassword,
                },
            });

            await transporter.sendMail({
                from: `"${senderName}" <${fromEmail}>`,
                to,
                subject,
                text,
                html,
            });

            console.log("sendEmail: SMTP Success");
            return { success: true };
        } else {
            console.error("sendEmail: Unknown or unconfigured email provider");
            return { success: false, error: "Email provider not configured correctly" };
        }

    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: error instanceof Error ? error.message : "Network error" };
    }
}
