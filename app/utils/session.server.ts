// manage session cookies
import bcrypt from "bcrypt";
import { db } from "./db.server";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

type LoginForm = {
    username: string;
    password: string;
};

// LOGIN USER
export async function login({ username, password }: LoginForm) {
    // find if user exist
    const user = await db.user.findUnique({
        where: {
            username,
        },
    });
    if (!user) return null;

    // Check password
    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isCorrectPassword) return null;

    return user;
}

// REGISTER USER
export async function register({ username, password }: LoginForm) {
    // find if user exist
    const user = await db.user.findUnique({
        where: {
            username,
        },
    });
    if (user) return null;

    const passwordHash = await bcrypt.hash(password, 10);
    return db.user.create({
        data: {
            username,
            passwordHash,
        },
    });
}

// GET SESSION SECRET
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("No session secret");
}

// CREATE SESSION STORAGE
const storage = createCookieSessionStorage({
    cookie: {
        name: "remix-post",
        secure: true,
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 60,
        httpOnly: true,
    },
});

export async function createUserSession(userId: string, redirectTo: string) {
    const session = await storage.getSession();
    session.set("userId", userId);
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        },
    });
}

// GET USER SESSION
export function getUserSession(request: Request) {
    return storage.getSession(request.headers.get("Cookie"));
}

// GET LOGGED IN USER
export async function getUser(request: Request) {
    const session = await getUserSession(request);
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") {
        return null;
    }

    try {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
        });
        return user;
    } catch {
        return null;
    }
}

// LOGOUT USER AND DESTROY SESSION
export async function logout(request: Request) {
    const session = await storage.getSession(request.headers.get("Cookie"));
    return redirect("/auth/logout", {
        headers: {
            "Set-Cookie": await storage.destroySession(session),
        },
    });
}

export async function getDefaultUser() {
    const user = await db.user.findUnique({
        where: {
            id: "2d5a4d16-1eda-4889-96be-3bd34c1ef10e",
        },
    });
    return user;
}
