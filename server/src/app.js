import express from "express";
import authRouter from "./routes/auth.routes.js";
import { requireAuth } from "./middleware/auth.middleware.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log("Req received");
//   next();
// });

app.get("/me", requireAuth, (req, res) => {
  res.json(req.user);
});

app.use("/api/v1/auth", authRouter);

export default app;
