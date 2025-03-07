import Joi from "joi";

export const signUpValidator = {
    body: Joi.object({
        firstName: Joi.string().min(2).max(30).required(),
        lastName: Joi.string().min(2).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(30).required().pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/
        ).messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password must be at most 30 characters"
        }),
        confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
            "any.only": "Passwords do not match"
        }),
        gender: Joi.string().valid("male", "female", "NA").default("NA"),
        DOB: Joi.date().iso().max("now").min(new Date(new Date().setFullYear(new Date().getFullYear() - 100))).required(),
        phone: Joi.string().pattern(/^\+?\d{10,15}$/).required().messages({
            "string.pattern.base": "Phone number must be a valid international format"
        }),
        role: Joi.string().valid("user", "admin").default("user"),
        // deletedAt: Joi.string().optional
    })
}

export const verifyAccountValidator = {
    body: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).pattern(/^\d{6}$/).required()
    })
}

export const loginValidator = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
}

export const forgetPasswordValidator = {
    body: Joi.object({
        email: Joi.string().email().required(),
    })
}

export const resetPasswordValidator = {
    body: Joi.object({
        email: Joi.string().email().required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Invalid email format"
            }),
        otp: Joi.string().length(6).pattern(/^\d+$/).required()
            .messages({
                "string.empty": "OTP is required",
                "string.length": "OTP must be exactly 6 digits",
                "string.pattern.base": "OTP must contain only numbers"
            }),
        password: Joi.string().min(8).max(30).required().pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/
        ).messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password must be at most 30 characters"
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
            .messages({
                "any.only": "Passwords do not match",
                "string.empty": "Confirm password is required"
            }),
    })
}
