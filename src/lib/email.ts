import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? "onboard@kvl-central.com"

export async function sendOtpEmail(email: string, otp: string, siteName?: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_your_api_key_here") {
    console.log(`[KVL Email] OTP for ${email}: ${otp}`)
    return { success: true, dev: true }
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: "KVL Central — Your verification code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="color:#7c3aed">KVL Central</h2>
        <p>Hello${siteName ? ` — verifying <strong>${siteName}</strong>` : ""},</p>
        <p>Your one-time verification code is:</p>
        <div style="background:#f3f0ff;border-radius:8px;padding:24px;text-align:center;margin:24px 0">
          <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#7c3aed">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:14px">This code expires in 10 minutes. Do not share it.</p>
      </div>
    `,
  })

  if (error) {
    console.error("[KVL Email] Send failed:", error)
    return { success: false, error }
  }
  return { success: true }
}

export async function sendWelcomeEmail(email: string, siteName: string, apiKey: string, subdomain: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_your_api_key_here") {
    console.log(`[KVL Email] Welcome for ${email} — subdomain: ${subdomain}, apiKey: ${apiKey}`)
    return { success: true, dev: true }
  }

  const installUrl = `https://${subdomain}.kvl-central.com`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Welcome to KVL Central — ${siteName} is connected!`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
        <h2 style="color:#7c3aed">KVL Central</h2>
        <h3>🎉 ${siteName} is now connected!</h3>
        <p>Your admin panel is ready at: <a href="${installUrl}">${installUrl}</a></p>
        <h4>Install the connector on your website:</h4>
        <pre style="background:#1e1e2e;color:#cdd6f4;padding:16px;border-radius:8px;font-size:14px">npm install @kvl/connect</pre>
        <pre style="background:#1e1e2e;color:#cdd6f4;padding:16px;border-radius:8px;font-size:14px">import { KVLConnect } from '@kvl/connect'
KVLConnect({ apiKey: '${apiKey}' })</pre>
        <p><strong>Your API Key:</strong> <code>${apiKey}</code></p>
        <p style="color:#6b7280;font-size:14px">Keep your API key secret.</p>
      </div>
    `,
  })

  return { success: true }
}
