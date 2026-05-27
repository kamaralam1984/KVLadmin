const encoder = new TextEncoder()

function b64url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function fromB64url(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/")
  const pad = padded.length % 4
  return atob(pad ? padded + "=".repeat(4 - pad) : padded)
}

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.JWT_SECRET ?? "kvl-fallback-secret-change-in-prod"
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

export interface TokenPayload {
  sub: string
  email: string
  role: string
  name: string
  iat: number
  exp: number
}

export async function signToken(payload: Omit<TokenPayload, "iat" | "exp">): Promise<string> {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body = b64url(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
  }))
  const key = await getKey()
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(`${header}.${body}`))
  const sigB64 = b64url(String.fromCharCode(...new Uint8Array(sig)))
  return `${header}.${body}.${sigB64}`
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const [header, body, sig] = parts
    const key = await getKey()
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      Uint8Array.from(fromB64url(sig), c => c.charCodeAt(0)),
      encoder.encode(`${header}.${body}`)
    )
    if (!valid) return null
    const payload = JSON.parse(fromB64url(body)) as TokenPayload
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}
