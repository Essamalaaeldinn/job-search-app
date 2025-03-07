import cron from "node-cron";
import UserModel from "../DB/Models/users.model.js";

cron.schedule("0 */6 * * *", async () => {
    const result = await UserModel.updateMany(
        {},
        { $pull: { otp: { expiresIn: { $lt: new Date() } } } }
    );
}, {
    scheduled: true,
    timezone: "Africa/Cairo"
})

