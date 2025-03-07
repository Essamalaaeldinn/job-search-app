import { globalErrorHandler } from "../Middlewares/errorHandler.middleware.js"
import adminRouters from "../Modules/Admin/admin.controller.js"
import authRouters from "../Modules/Auth/auth.controller.js"
import companyRouters from "../Modules/Company/company.controller.js"
import userRouters from "../Modules/User/user.controller.js"

const controllerHandler = (app) => {
    app.use('/auth', authRouters)
    app.use('/user', userRouters)
    app.use('/company', companyRouters)
    app.use('/admin', adminRouters)
    app.use(globalErrorHandler)
}

export default controllerHandler