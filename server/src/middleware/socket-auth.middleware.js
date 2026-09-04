import { parseCookie } from "cookie";
import crypto from "node:crypto";
import { db } from "../prisma/db.ts";

export const socketAuth = async (socket, next) => {
  try {
    const cookie = parseCookie(socket.handshake.headers.cookie || "");

    const token = cookie.session;

    if (!token) {
      return next(new Error("Authentication failed."));
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const session = await db.orm.public.Session.first({
      tokenHash,
    });

    if (!session) {
      return next(new Error("Authentication failed."));
    }

    if (new Date(session.expiresAt) <= new Date()) {
      return next(new Error("Authentication failed."));
    }

    const user = await db.orm.public.User.first({
      id: session.userId,
    });

    if (!user) {
      return next(new Error("Authentication failed."));
    }

    socket.user = user;

    next();
  } catch (error) {
    console.error("Socket authentication failed:", error);

    next(new Error("Authentication failed."));
  }
};
