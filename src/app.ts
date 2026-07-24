import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import { authenticate, AuthRequest } from "./middleware/auth.middleware";
import taskRoutes from "./routes/task.routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Task Manager API is running 🚀",
  });
});


app.get("/api/profile", authenticate, (req: AuthRequest, res) => {
  res.json({
    success: true,
    message: "Protected route accessed",
    user: req.user,
  });
});

app.use("/api/tasks", taskRoutes);

export default app;