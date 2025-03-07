import UserModel from "../DB/Models/users.model.js"

export const checkAuthUser = async (req, res, next) => {
    const user = await UserModel.findById(req.loginUser._id)
    if (!user || (user.deletedAt && user.deletedAt <= new Date()) || (user.bannedAt && user.bannedAt <= new Date()))
        return res.status(404).json({ message: "User not found" });
    req.user = user;
    next()
}