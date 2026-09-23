/**
 * Client-side End-to-End Encryption utility using Web Crypto API (AES-256-GCM).
 * The Room Code acts as the pre-shared encryption key.
 */

// Helper: Convert string to Uint8Array
function strToBuf(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Helper: Convert Uint8Array to string
function bufToStr(buf: ArrayBuffer): string {
  return new TextDecoder().decode(buf);
}

// Helper: ArrayBuffer to Base64
function bufToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Base64 to Uint8Array
function base64ToBuf(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Fixed salt for deriving key from room code
const SALT = strToBuf('capstone-feasibility-v1-salt');

/**
 * Derives an AES-GCM CryptoKey from a user's Room Code using PBKDF2.
 */
async function deriveKey(roomCode: string): Promise<CryptoKey> {
  const normalizedCode = roomCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    strToBuf(normalizedCode) as unknown as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export interface EncryptedPayload {
  iv: string; // Base64
  ciphertext: string; // Base64
  version: number;
}

/**
 * Encrypts any JSON-serializable room data with the Room Code.
 */
export async function encryptData<T>(data: T, roomCode: string): Promise<string> {
  const key = await deriveKey(roomCode);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const plaintext = JSON.stringify(data);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as unknown as BufferSource },
    key,
    strToBuf(plaintext) as unknown as BufferSource
  );

  const payload: EncryptedPayload = {
    iv: bufToBase64(iv.buffer),
    ciphertext: bufToBase64(encryptedBuffer),
    version: 1
  };

  return JSON.stringify(payload);
}

/**
 * Decrypts encrypted string payload using the Room Code.
 * Throws an error if the Room Code is invalid or data is corrupted.
 */
export async function decryptData<T>(encryptedString: string, roomCode: string): Promise<T> {
  const key = await deriveKey(roomCode);
  const payload: EncryptedPayload = JSON.parse(encryptedString);

  const iv = base64ToBuf(payload.iv);
  const ciphertext = base64ToBuf(payload.ciphertext);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as unknown as BufferSource },
    key,
    ciphertext as unknown as BufferSource
  );

  const plaintext = bufToStr(decryptedBuffer);
  return JSON.parse(plaintext) as T;
}

/**
 * Generates a clean, memorable Room Code formatted as CAP-XXXX (e.g. CAP-7429)
 */
export function generateRoomCode(): string {
  const digits = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = 'CAP-';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    code += digits[randomIndex];
  }
  return code;
}

/**
 * Normalizes input room code (e.g. "cap7429" -> "CAP-7429")
 */
export function formatRoomCode(input: string): string {
  const cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (cleaned.startsWith('CAP') && cleaned.length > 3) {
    return `CAP-${cleaned.slice(3, 7)}`;
  }
  if (cleaned.length <= 4) {
    return cleaned;
  }
  return `CAP-${cleaned.slice(0, 4)}`;
}
