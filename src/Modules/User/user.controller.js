import { Router } from "express";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandler.middleware.js";
import * as user from "./Service/user.service.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import * as validator from "../../Validators/User/user.validators.js";
import { checkAuthUser } from "../../Middlewares/checkUser.middleware.js";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware.js";

const userRouters = Router()

userRouters.patch('/updateAccount',
    validationMiddleware(validator.updateAccountValidators),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(user.updateUserAccountService)
)

userRouters.get('/userData',
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(user.userData)
)

userRouters.get('/profileData/:userId',
    errorHandlerMiddleware(user.profileData)
);

userRouters.patch('/updatePassword',
    validationMiddleware(validator.updatePasswordValidators),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(user.updatePassword)
)

userRouters.delete('/deleteAccount',
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(user.deleteAccount)
)

export default userRouters;