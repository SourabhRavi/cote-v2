import { db } from "../../prisma/db.ts";
import crypto from "node:crypto";

const generateSessionToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  return { token, tokenHash };
};

export const createSession = async (userId) => {
  const { token, tokenHash } = generateSessionToken();

  const expiresAt = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ).toISOString();

  await db.orm.public.Session.create({
    tokenHash: tokenHash,
    userId: userId,
    expiresAt: expiresAt,
  });

  return token;
};

export const findOrCreateUserByGoogleId = async (payload) => {
  const { sub, email, name, picture } = payload;

  const user = await db.orm.public.User.first({
    googleId: sub,
  });

  if (user) {
    return user;
  }

  return await db.orm.public.User.create({
    googleId: sub,
    email: email,
    name: name,
    avatarUrl: picture,
  });
};

export const deleteSession = async (token) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const deleted = await db.orm.public.Session.delete({
    tokenHash: tokenHash,
  });

  return deleted;
};
