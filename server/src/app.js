import express from "express";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log("Req received");
  next();
});

app.get("/", (req, res) => {
  res.send("This is the / route");
});

export default app;
