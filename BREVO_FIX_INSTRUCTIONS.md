# Fixing Brevo Email "Unrecognized IP Address" Error

If you are seeing the error: `Brevo Error: We have detected you are using an unrecognized IP address...`

This is because your Brevo account or API key has IP restrictions enabled. Vercel uses dynamic IP addresses (AWS Lambda), so you cannot whitelist a specific IP.

## 🚀 The Fix (Takes less than 1 minute)

1. **Log in to Brevo:**
   Go to your [Brevo Dashboard](https://app.brevo.com).

2. **Navigate to API Keys:**
   Go to **Settings** > **SMTP & API** > **API Keys**.
   Direct Link: [https://app.brevo.com/settings/keys/api](https://app.brevo.com/settings/keys/api)

3. **Check Authorized IPs:**
   Look for a section called **"Manage authorized IPs"** or similar under "Security".
   Or check the specific API Key you are using.

4. **Disable IP Check:**
   - Usually, you need to **Remove all IP addresses** from the allowlist to allow access from any IP (which is required for Vercel).
   - Alternatively, disable the **"Restrict API Key to specific IP addresses"** toggle if available.

5. **Wait a Moment:**
   Sometimes it takes a minute for the changes to propagate.

6. **Deploy:**
   Once done, your application on Vercel should be able to send emails without issues.

## Why is this happening?
Vercel runs your code on AWS servers that change IP addresses frequently. Brevo's security check sees a "new" IP and blocks it unless you tell Brevo to allow all IPs for API access.
