import { Router } from "express";
import { roles } from "../../Constants/constants.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandler.middleware.js";
import { checkAuthUser } from "../../Middlewares/checkUser.middleware.js";
import { authorizationMiddleware } from "../../Middlewares/authirization.middleware.js";
import * as admin from "./Service/admin.service.js";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware.js";

const adminRouters = Router()

const { ADMIN } = roles

adminRouters.post('/approveCompany',
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    authorizationMiddleware([ADMIN]),
    errorHandlerMiddleware(admin.approveCompanyService)
)

adminRouters.post('/bannedUser',
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    authorizationMiddleware([ADMIN]),
    errorHandlerMiddleware(admin.banUserService)
)

adminRouters.post('/bannedCompany',
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    authorizationMiddleware([ADMIN]),
    errorHandlerMiddleware(admin.banCompanyService)
)

export default adminRouters