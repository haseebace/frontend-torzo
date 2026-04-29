import "server-only";
import crypto from "node:crypto";

type EncryptedSecret = {
  ciphertext: string;
  iv: string;
  tag: string;
};

function getEncryptionKey() {
  const secret = process.env.REAL_DEBRID_ENCRYPTION_KEY;

  if (!secret) {
    throw new Error("REAL_DEBRID_ENCRYPTION_KEY is not configured.");
  }

  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptSecret(value: string): EncryptedSecret {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);

  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
  };
}

export function decryptSecret(secret: EncryptedSecret) {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(secret.iv, "base64")
  );

  decipher.setAuthTag(Buffer.from(secret.tag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(secret.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
}
