import mongoose from "mongoose";
import * as constants from "../../Constants/constants.js";

const applicationModelSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'jobs',
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        userCV: {
            secure_url: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
                required: true
            }
        },
        status: {
            type: String,
            default: constants.applicationStatus.PENDING,
            enum: Object.values(constants.applicationStatus)
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const ApplicationModel = mongoose.models.application || mongoose.model('application', applicationModelSchema)

export default ApplicationModel
