import express from "express";
import cors from "cors";
import dashboardRoutes from "./routes/dashboardRoutes";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Loopr API is running"
  });
});
import authRoutes from "./routes/authRoutes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

// ...after app.use(express.json());
app.use("/api/auth", authRoutes);
// ...alongside the auth routes
app.use("/api/dashboard", dashboardRoutes);
// ...at the very end, after all routes:
app.use(notFoundHandler);
app.use(errorHandler);


export default app;