import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";
import connnectDB from "./database/mongoDB.js";
import { app, server } from "./lib/socket.js";

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

server.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connnectDB();
});
