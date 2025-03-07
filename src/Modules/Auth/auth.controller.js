import { Router } from "express";
import * as auth from "./Services/authentication.service.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandler.middleware.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import * as validation from "../../Validators/Auth/auth.validator.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";

const authRouters = Router();

authRouters.post(
  "/signup",
  validationMiddleware(validation.signUpValidator),
  errorHandlerMiddleware(auth.signUpService)
);

authRouters.post(
  "/verifyAccount",
  validationMiddleware(validation.verifyAccountValidator),
  errorHandlerMiddleware(auth.verifyAccountService)
);

authRouters.post(
  "/login",
  validationMiddleware(validation.loginValidator),
  errorHandlerMiddleware(auth.loginService)
);

authRouters.get(
  "/genRefreshToken",
  errorHandlerMiddleware(auth.refreshTokenService)
);

authRouters.get(
  "/logout",
  errorHandlerMiddleware(authenticationMiddleware()),
  errorHandlerMiddleware(auth.logoutService)
);

authRouters.post(
  "/forgetPassword",
  validationMiddleware(validation.forgetPasswordValidator),
  errorHandlerMiddleware(auth.forgetPasswordService)
);

authRouters.post(
  "/resetPassword",
  validationMiddleware(validation.resetPasswordValidator),
  errorHandlerMiddleware(auth.resetPasswordService)
);


// Google OAuth routes
authRouters.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouters.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login" }),
  async (req, res) => {
    const accesstoken = jwt.sign(
      { _id: req.user._id, email: req.user.email },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "1h", jwtid: uuidv4() }
    );
    const refreshtoken = jwt.sign(
      { _id: req.user._id, email: req.user.email },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "7d", jwtid: uuidv4() }
    );
    res.redirect(
      `http://localhost:3000?accesstoken=${accesstoken}&refreshtoken=${refreshtoken}`
    );
  }
);

export default authRouters;
