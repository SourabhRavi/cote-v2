import crypto from "node:crypto";
import { db } from "../prisma/db.ts";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.session;
    if (!token) {
      throw Error("Session cookie is missing.");
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const session = await db.orm.public.Session.first({
      tokenHash: tokenHash,
    });

    if (!session) {
      throw Error("Session not found.");
    }

    if (new Date(session.expiresAt) <= new Date()) {
      throw Error("Session has expired.");
    }

    const user = await db.orm.public.User.first({
      id: session.userId,
    });

    if (!user) {
      throw Error("User associated with session was not found.");
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication failed:", error);
    throw Error("Authentication failed while validating the session.");
  }
};
