import { Router } from "express";
import oauth2Client from "../../config/google.js";
import {
  createSession,
  deleteSession,
  findOrCreateUserByGoogleId,
} from "../auth/auth.service.js";

const router = Router();

router.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    prompt: "select_account",
    scope: ["openid", "email", "profile"],
  });

  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  if (typeof code !== "string") {
    return res.status(400).send("Invalid authorization code");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    console.log("tokens:", tokens);

    if (typeof tokens.id_token !== "string") {
      return res.status(400).send("Invalid ID token", tokens.id_token);
    }

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
    });

    const payload = ticket.getPayload();

    const user = await findOrCreateUserByGoogleId(payload);

    const token = await createSession(user.id);

    // set the cookie
    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    console.error("Invalid ID Token:", error);
    return res.status(401).send("Invalid ID token");
  }
});

router.post("/logout", async (req, res) => {
  if (!req.cookies.session) {
    return res.status(401).send("Cannot logout. Session not found.");
  }

  try {
    const deleted = await deleteSession(req.cookies.session);

    if (!deleted) {
      return res.status(401).send("Cannot logout.");
    }

    res.clearCookie("session");
    return res.status(204).send();
  } catch (error) {
    console.error("Failed to logout:", error);
    return res.status(500).send("Failed to logout. Please try after sometime.");
  }
});

export default router;
