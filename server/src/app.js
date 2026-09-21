import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import authRouter from "./modules/auth/auth.routes.js";
import workspaceRouter from "./modules/workspace/workspace.route.js";
import channelRouter from "./modules/channel/channel.route.js";
import messageRouter from "./modules/message/message.route.js";
import { requireAuth } from "./middleware/auth.middleware.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/resume", (req, res) => {
  const resumePath = path.join(__dirname, "..", "public", "resume.pdf");

  res.setHeader("Content-Disposition", "inline");
  res.sendFile(resumePath, (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Resume could not be opened.",
      });
    }
  });
});

app.use("/api/v1/auth", authRouter);
app.get("/api/v1/me", requireAuth, (req, res) => {
  res.json({
    success: true,
    data: req.user,
    error: null,
  });
});
app.use("/api/v1/workspaces", requireAuth, workspaceRouter);
app.use("/api/v1/channels", requireAuth, channelRouter);
app.use("/api/v1/messages", requireAuth, messageRouter);

export default app;
