import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";
import userRoutes from "./routes/user.route.js";

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";

// ─── Connect to MongoDB immediately ─────────────────────────────────────────
connectDB();

const app = express();
const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();

// CORS
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

// Health‐check
app.use("/test", (req, res) => res.send("Hello World"));

// Public auth routes
app.use("/api/v1/auth", authRoutes);

// Protected routes
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);
app.use("/api/v1/user", protectRoute, userRoutes);

// 404
app.use((req, res) => res.status(404).send("Not Found"));

// Serve SPA in production
if (ENV_VARS.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Only start a listener for local/dev—Vercel will import `app` directly
if (ENV_VARS.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}

export default app;
