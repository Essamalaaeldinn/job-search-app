import jwt from "jsonwebtoken";
import BlackListTokensModel from "../DB/Models/blackedListTokens.model.js";
import UserModel from "../DB/Models/users.model.js";

// authentication middleware
export const authenticationMiddleware = () => {
  return async (req, res, next) => {
    const { accesstoken } = req.headers;
    if (!accesstoken)
      return res.status(400).json({ message: "accesstoken required" });
    const decodedData = jwt.verify(accesstoken, process.env.JWT_ACCESS_TOKEN);
    const isTokenBlackListed = await BlackListTokensModel.findOne({
      tokenId: decodedData.jti,
    });
    if (isTokenBlackListed)
      return res
        .status(401)
        .json({ message: "Token expired please, Login again" });
    const user = await UserModel.findById(decodedData._id);
    if (!user)
      return res.status(404).json({ message: "user not found please, signup" });
    req.loginUser = user;
    req.loginUser.token = {
      tokenId: decodedData.jti,
      expiryDate: decodedData.exp,
    };
    next();
  };
};
