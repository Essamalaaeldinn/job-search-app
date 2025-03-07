import * as constants from "../../Constants/constants.js";
import mongoose from "mongoose";

const jobOpportunityModelSchema = new mongoose.Schema(
    {
        jobTitle: {
            type: String,
            required: true,
        },
        jobLocation: {
            type: String,
            enum: Object.values(constants.jobLocation),
            required: true
        },
        workingTime: {
            type: String,
            enum: Object.values(constants.workingTime),
            required: true,
        },
        seniorityLevel: {
            type: String,
            required: true,
            enum: Object.values(constants.seniorityLeve)
        },
        jobDescription: {
            type: String,
            required: true,
        },
        technicalSkills: [{
            type: String,
            required: true,
        }],
        softSkills: [{
            type: String,
            required: true,
        }],
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        closed: {
            type: Boolean,
            default: false
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'company',
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

const JobOpportunityModel = mongoose.models.job || mongoose.model('jobs', jobOpportunityModelSchema);

export default JobOpportunityModel;
