import express from "express";
import session from "express-session"; // Import express-session
import path from "path";
import database_connection from "./DB/connection.js";
import "./Services/cronJob.service.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";
import controllerHandler from "./Utils/routersHandler.utils.js";
import "./Services/passportConfig.service.js"; // Ensure this file is executed
import dotenv from "dotenv";

dotenv.config();

const boostrap = function () {
  const app = express();
  const port = process.env.PORT;

  // Security middleware
  app.use(helmet()); // Adds security headers
  app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true })); // Enable CORS
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: "Too many requests from this IP, please try again later.",
    })
  );

  // Enable session support for Passport
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "mysecret", // Use a strong secret
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Set to true in production with HTTPS
    })
  );

  // Initialize Passport session
  app.use(passport.initialize());
  app.use(passport.session()); // <-- Required for persistent login sessions

  // Database and app setup
  database_connection();
  app.use(express.json());
  controllerHandler(app);
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

export default boostrap;
