import { AuthTokenPayload, User } from '../types/auth';

const TOKEN_EXPIRATION_SECONDS = 3600; // 1 hour token validity

const base64UrlEncode = (str: string): string => {
  try {
    return btoa(str)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  } catch {
    return '';
  }
};

const base64UrlDecode = (str: string): string => {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return atob(base64);
  } catch {
    return '';
  }
};

/**
 * Generate a JWT token for a given user
 */
export const generateMockJWT = (user: User): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);

  const payload: AuthTokenPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + TOKEN_EXPIRATION_SECONDS,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode(`postpulse_secret_key_sig_${user.id}_${now}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

/**
 * Safely decode a JWT token payload
 */
export const decodeJWT = (token: string): AuthTokenPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadStr = base64UrlDecode(parts[1]);
    if (!payloadStr) return null;
    return JSON.parse(payloadStr) as AuthTokenPayload;
  } catch {
    return null;
  }
};

/**
 * Verify if a JWT token is valid and not expired
 */
export const isJWTValid = (token: string | null): boolean => {
  if (!token) return false;
  const payload = decodeJWT(token);
  if (!payload) return false;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
};
