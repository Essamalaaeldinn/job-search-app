import mongoose from "mongoose";

const blackListSchema = new mongoose.Schema({
    tokenId: {
        type: String,
        required: true,
        unique: true,
    },
    expiryDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
})

const BlackListTokensModel = mongoose.models.BlackListTokens || mongoose.model('BlackListTokens', blackListSchema)

export default BlackListTokensModel