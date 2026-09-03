import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes.js";
import workspaceRouter from "./modules/workspace/workspace.route.js";
import channelRouter from "./modules/channel/channel.route.js";
import messageRouter from "./modules/message/message.route.js";
import { requireAuth } from "./middleware/auth.middleware.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.get("/api/v1/me", requireAuth, (req, res) => {
  res.json(req.user);
});
app.use("/api/v1/workspaces", requireAuth, workspaceRouter);
app.use("/api/v1/channels", requireAuth, channelRouter);
app.use("/api/v1/messages", requireAuth, messageRouter);

export default app;
