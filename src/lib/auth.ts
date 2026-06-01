import { jwtVerify, SignJWT, JWTPayload } from "jose";

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

const ACCESS_TOKEN_TTL_MINUTES = Number(
  process.env.ACCESS_TOKEN_TTL_MINUTES || "15"
);
const REFRESH_TOKEN_TTL_DAYS = Number(
  process.env.REFRESH_TOKEN_TTL_DAYS || "7"
);

export interface SessionUser {
  id: string;
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
}

export interface SessionTokenPayload extends JWTPayload {
  type: "access" | "refresh";
  user: SessionUser;
}

export function getJwtSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || "replace-with-strong-secret"
  );
}

export function getAccessTokenMaxAge() {
  return ACCESS_TOKEN_TTL_MINUTES * 60;
}

export function getRefreshTokenMaxAge() {
  return REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60;
}

async function signSessionToken(
  user: SessionUser,
  type: SessionTokenPayload["type"],
  expiresIn: string
) {
  return new SignJWT({ type, user })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecret());
}

export function signAccessToken(user: SessionUser) {
  return signSessionToken(user, "access", `${ACCESS_TOKEN_TTL_MINUTES}m`);
}

export function signRefreshToken(user: SessionUser) {
  return signSessionToken(user, "refresh", `${REFRESH_TOKEN_TTL_DAYS}d`);
}

export async function verifySessionToken(
  token: string,
  expectedType: SessionTokenPayload["type"]
) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  const typedPayload = payload as SessionTokenPayload;

  if (typedPayload.type !== expectedType || !typedPayload.user) {
    throw new Error("Invalid token type");
  }

  return typedPayload;
}

export function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
