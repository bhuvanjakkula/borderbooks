import crypto from "crypto";

const TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getSecret(): string {
  return (
    process.env.PASSWORD_RESET_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    "borderbooks-reset-signing-secret-v1"
  );
}

export function createResetToken(email: string): string {
  const normalized = email.trim().toLowerCase();
  const payload = JSON.stringify({
    email: normalized,
    exp: Date.now() + TOKEN_TTL_MS,
    nonce: crypto.randomBytes(8).toString("hex"),
  });
  const encodedPayload = Buffer.from(payload, "utf8").toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${sig}`;
}

export function verifyResetToken(
  token: string,
  expectedEmail?: string
): { valid: true; email: string } | { valid: false; reason: string } {
  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, reason: "Invalid password reset link format." };
  }
  const [encodedPayload, providedSig] = parts;
  const expectedSig = crypto
    .createHmac("sha256", getSecret())
    .update(encodedPayload)
    .digest("base64url");

  const sigBufA = Buffer.from(providedSig, "utf8");
  const sigBufB = Buffer.from(expectedSig, "utf8");
  if (sigBufA.length !== sigBufB.length || !crypto.timingSafeEqual(sigBufA, sigBufB)) {
    return { valid: false, reason: "Invalid or tampered password reset link." };
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as { email?: string; exp?: number };
    if (!decoded.email || !decoded.exp) {
      return { valid: false, reason: "Malformed password reset token." };
    }
    if (Date.now() > decoded.exp) {
      return { valid: false, reason: "This password reset link has expired. Please request a new one." };
    }
    if (expectedEmail && decoded.email !== expectedEmail.trim().toLowerCase()) {
      return { valid: false, reason: "Reset link does not match this email address." };
    }
    return { valid: true, email: decoded.email };
  } catch {
    return { valid: false, reason: "Could not decode password reset token." };
  }
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}
