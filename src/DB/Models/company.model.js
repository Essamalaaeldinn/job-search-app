import mongoose from "mongoose";
import JobOpportunityModel from "./jobOpportunity.model.js"; 

const companyModelSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true,
        },
        industry: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        numberOfEmployees: {
            type: String,
            required: true,
            match: /^[0-9]+-[0-9]+$/,
            validate: {
                validator: function (value) {
                    const range = value.split("-").map(Number);
                    return range.length === 2 && range[0] < range[1];
                },
                message: "numberOfEmployees must be a valid range like '11-20'"
            }
        },
        companyEmail: {
            type: String,
            required: true,
            unique: true
        },
        CreatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        HRs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        }],
        logo: {
            secure_url: String,
            public_id: String
        },
        coverPic: {
            secure_url: String,
            public_id: String
        },
        deletedAt: Date,
        bannedAt: Date,
        approvedByAdmin: {
            type: Boolean,
            default: false
        },
        legalAttachment: {
            secure_url: String,
            public_id: String
        },

    },
    {
        timestamps: true
    }
);

// Hook to delete related jobs when a company is soft-deleted
companyModelSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.deletedAt && update.deletedAt <= new Date()) {
        const companyId = this.getQuery()._id;
        await JobOpportunityModel.updateMany(
            { companyId },
            { $set: { deletedAt: new Date() } } // Soft-delete jobs
        );
    }
    next();
});



const CompanyModel = mongoose.models.company || mongoose.model('company', companyModelSchema)

export default CompanyModel