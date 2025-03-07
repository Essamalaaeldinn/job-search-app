import mongoose from "mongoose";
import * as constants from "../../Constants/constants.js";
import {
  comparing,
  decryption,
  encryption,
  hashing,
} from "../../Utils/crypto.utils.js";
import ApplicationModel from "./application.model.js";

const userModelSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: String,
    provider: {
      type: String,
      default: constants.providers.SYSTEM,
      enum: Object.values(constants.providers),
    },
    gender: {
      type: String,
      default: constants.gender.NA,
      enum: Object.values(constants.gender),
    },
    DOB: {
      type: Date,
      validate: {
        validator: function (value) {
          const today = new Date();
          const minAge = new Date();
          minAge.setFullYear(today.getFullYear() - 18);
          return value < today && value <= minAge;
        },
        message:
          "DOB must be a valid date and user must be at least 18 years old",
      },
    },
    phone: String,
    role: {
      type: String,
      default: constants.roles.USER,
      enum: Object.values(constants.roles),
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    bannedAt: Date,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    changeCredentialTime: Date,
    otp: [
      {
        code: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: Object.values(constants.otpUsage),
          required: true,
        },
        expiresIn: {
          type: Date,
          required: true,
        },
      },
    ],
    profilePic: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hook to delete applications when a user is soft-deleted
userModelSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.deletedAt && update.deletedAt <= new Date()) {
    const userId = this.getQuery()._id;
    await ApplicationModel.updateMany(
      { userId },
      { $set: { deletedAt: new Date() } }
    );
  }
  next();
});

// Pre-save hook for encryption
userModelSchema.pre("save", async function (next) {
    if (this.isModified("phone"))
      this.phone = encryption(this.phone, process.env.SECRET_KEY);
    next();
  });

// Virtual field for user full name
userModelSchema.virtual("userName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Post-init hook to decrypt phone number when fetching data
userModelSchema.post("init", function (doc) {
  if (doc.phone) {
    doc.phone = decryption(doc.phone, process.env.SECRET_KEY);
  }
});

const UserModel =
  mongoose.models.users || mongoose.model("users", userModelSchema);

export default UserModel;
