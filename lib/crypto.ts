import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'

function getEncryptionKey(): Buffer {
  const key = process.env.AI_ENCRYPTION_KEY
  if (!key) {
    throw new Error('AI_ENCRYPTION_KEY is not set in environment variables.')
  }
  // Derive a 32-byte key from the env variable using SHA-256
  return crypto.createHash('sha256').update(key).digest()
}

/**
 * Encrypts a plaintext string using AES-256-CBC.
 * Returns a string in the format: `iv_hex:encrypted_hex`
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  let encrypted = cipher.update(plaintext, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return `${iv.toString('hex')}:${encrypted}`
}

/**
 * Decrypts a string encrypted by the `encrypt` function.
 * Expects input in the format: `iv_hex:encrypted_hex`
 * Returns the original plaintext.
 * If the input doesn't look encrypted (no colon), returns it as-is (backward compatibility).
 */
export function decrypt(encryptedText: string): string {
  // Backward compatibility: if the value doesn't look encrypted, return as-is
  if (!encryptedText || !encryptedText.includes(':')) {
    return encryptedText
  }

  // Additional check: both parts should be valid hex strings
  const parts = encryptedText.split(':')
  if (parts.length !== 2) return encryptedText
  
  const [ivHex, dataHex] = parts
  // IV should be 32 hex chars (16 bytes), data should be non-empty hex
  if (ivHex.length !== 32 || !/^[0-9a-f]+$/i.test(ivHex) || !/^[0-9a-f]+$/i.test(dataHex)) {
    return encryptedText
  }

  try {
    const key = getEncryptionKey()
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    let decrypted = decipher.update(dataHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch {
    // If decryption fails (e.g. key changed), return original value
    console.warn('Failed to decrypt API key, returning raw value.')
    return encryptedText
  }
}
