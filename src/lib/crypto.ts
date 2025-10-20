import crypto from "crypto"

function getKey(): Buffer {
  const raw = process.env.PTERO_CRED_KEY || ""
  if (!raw) throw new Error("PTERO_CRED_KEY is not set")
  // support base64 or hex or plain utf-8 padded
  try {
    const b64 = Buffer.from(raw, "base64")
    if (b64.length === 32) return b64
  } catch {}
  try {
    const hex = Buffer.from(raw, "hex")
    if (hex.length === 32) return hex
  } catch {}
  const buf = Buffer.alloc(32)
  Buffer.from(raw).copy(buf)
  return buf
}

export function encrypt(text: string): string {
  const key = getKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  const enc = Buffer.concat([cipher.update(text, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, enc]).toString("base64")
}

export function decrypt(payload: string): string {
  const key = getKey()
  const buf = Buffer.from(payload, "base64")
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const data = buf.subarray(28)
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
  decipher.setAuthTag(tag)
  const dec = Buffer.concat([decipher.update(data), decipher.final()])
  return dec.toString("utf8")
}
