import Joi from "joi";

export const updateAccountValidators = {
    body: Joi.object({
        firstName: Joi.string().min(3).max(30).optional(),
        lastName: Joi.string().min(3).max(30).optional(),
        phone: Joi.string().pattern(/^\d{10,15}$/).optional(),
        DOB: Joi.date().iso().optional(),
        gender: Joi.string().optional(),
        role: Joi.string().valid("user", "admin").optional()
    })
}

export const updatePasswordValidators = {
    body: Joi.object({
        oldPassword: Joi.string().min(8).max(30).required(),
        newPassword: Joi.string().min(8).max(30).required().pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/
        ).messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password must be at most 30 characters"
        }),
        confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
            .messages({
                "any.only": "Passwords do not match",
                "string.empty": "Confirm password is required"
            }),
    })
};