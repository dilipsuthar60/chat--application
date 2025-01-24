import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import { databaseConnection } from "./lib/database.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5002;
app.use("api/auth", authRoutes);
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
  databaseConnection();
});
