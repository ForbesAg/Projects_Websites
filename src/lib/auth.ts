import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "lexintel-local-secret-key-change-in-production-2026"
);

const SESSION_COOKIE = "lexintel_session";
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Cashier" | "Accountant";
  branch: string;
  mustChangePassword: boolean;
}

export async function createSession(userId: number): Promise<string> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  const token = await new SignJWT({ sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(JWT_SECRET);

  return token;
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const sessionId = payload.sessionId as string;

    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .get();

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .get();

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as SessionUser["role"],
      branch: user.branch,
      mustChangePassword: user.mustChangePassword,
    };
  } catch {
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const sessionId = payload.sessionId as string;

    await db.delete(sessions).where(eq(sessions.id, sessionId));
  } catch {
    // ignore errors on logout
  }
}

export { SESSION_COOKIE };
