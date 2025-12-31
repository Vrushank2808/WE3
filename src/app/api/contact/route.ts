import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { SITE_CONFIG } from '@/lib/constants'

export const runtime = 'nodejs'

function isValidEmail(value: string) {
    // Simple, pragmatic email check (server-side)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function escapeHtml(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
}

export async function POST(req: Request) {
    let body: unknown
    try {
        body = await req.json()
    } catch {
        return NextResponse.json(
            { ok: false, error: 'Invalid JSON body' },
            { status: 400 }
        )
    }

    const payload = body as Partial<Record<'name' | 'email' | 'message', unknown>>
    const name = String(payload?.name ?? '').trim()
    const email = String(payload?.email ?? '').trim()
    const message = String(payload?.message ?? '').trim()

    if (!name || name.length > 120) {
        return NextResponse.json(
            { ok: false, error: 'Please provide your name.' },
            { status: 400 }
        )
    }

    if (!email || !isValidEmail(email) || email.length > 200) {
        return NextResponse.json(
            { ok: false, error: 'Please provide a valid email address.' },
            { status: 400 }
        )
    }

    if (!message || message.length > 5000) {
        return NextResponse.json(
            { ok: false, error: 'Please enter a message.' },
            { status: 400 }
        )
    }

    const smtpHost = process.env.SMTP_HOST
    const smtpPort = Number(process.env.SMTP_PORT ?? 465)
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpSecure =
        process.env.SMTP_SECURE != null
            ? process.env.SMTP_SECURE === 'true'
            : smtpPort === 465

    if (!smtpHost || !smtpUser || !smtpPass) {
        return NextResponse.json(
            {
                ok: false,
                error:
                    'Email is not configured on the server. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (and optionally SMTP_SECURE).',
            },
            { status: 500 }
        )
    }

    const toEmail = process.env.CONTACT_TO_EMAIL ?? SITE_CONFIG.email
    const fromEmail =
        process.env.CONTACT_FROM_EMAIL ?? `${SITE_CONFIG.name} Website <${smtpUser}>`

    const transport = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    })

    const subject = `New message from ${name}`
    const text = `Name: ${name}\nEmail: ${email}\n\n${message}`
    const html = `
    <h2>New website message</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <pre style="white-space:pre-wrap;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">${escapeHtml(
        message
    )}</pre>
  `

    await transport.sendMail({
        to: toEmail,
        from: fromEmail,
        replyTo: email,
        subject,
        text,
        html,
    })

    return NextResponse.json({ ok: true })
}
