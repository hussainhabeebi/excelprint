import { scrypt } from "@noble/hashes/scrypt.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";

/**
 * Password hashing using scrypt (pure JS, no native bindings) — Workers has
 * no `node:crypto` scrypt/bcrypt, so this is the Cloudflare-compatible
 * choice. Cost parameters follow OWASP's current scrypt guidance.
 */
const SCRYPT_N = 2 ** 15;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 32;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = scrypt(new TextEncoder().encode(password), salt, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    dkLen: KEY_LENGTH,
  });
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${bytesToHex(salt)}$${bytesToHex(derived)}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, nStr, rStr, pStr, saltHex, hashHex] = parts;
  const derived = scrypt(new TextEncoder().encode(password), hexToBytes(saltHex), {
    N: Number(nStr),
    r: Number(rStr),
    p: Number(pStr),
    dkLen: hexToBytes(hashHex).length,
  });
  return timingSafeEqual(derived, hexToBytes(hashHex));
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
