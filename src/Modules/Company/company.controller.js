// src/Modules/Company/company.controller.js

import { Router } from "express";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import * as validator from "../../Validators/Company/company.validator.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandler.middleware.js";
import * as companyService from "./Service/company.service.js"; // ✅ Correct import
import { checkAuthUser } from "../../Middlewares/checkUser.middleware.js";
import adminRouters from "../Admin/admin.controller.js";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../Middlewares/authirization.middleware.js";

const companyRouters = Router();

companyRouters.post(
  "/approveCompany",
  authenticationMiddleware(),
  checkAuthUser,
  authorizationMiddleware([adminRouters]),
  errorHandlerMiddleware(companyService.approveCompanyService) // ✅ Correct usage
);

companyRouters.put(
  "/updateCompany/:companyId",
  errorHandlerMiddleware(companyService.updateCompanyService)
);

companyRouters.delete(
  "/softDeleteCompany/:companyId",
  errorHandlerMiddleware(companyService.softDeleteCompanyService)
);

companyRouters.get(
  "/getCompanyWithJobs/:companyId",
  errorHandlerMiddleware(companyService.getCompanyWithJobsService)
);

companyRouters.get(
  "/searchCompany",
  errorHandlerMiddleware(companyService.searchCompanyService)
);

companyRouters.post(
  "/uploadLogo/:companyId",
  errorHandlerMiddleware(companyService.uploadLogoService)
);

companyRouters.post(
  "/uploadCoverPic/:companyId",
  errorHandlerMiddleware(companyService.uploadCoverPicService)
);

companyRouters.delete(
  "/deleteLogo/:companyId",
  errorHandlerMiddleware(companyService.deleteLogoService)
);

companyRouters.delete(
  "/deleteCoverPic/:companyId",
  errorHandlerMiddleware(companyService.deleteCoverPicService)
);

export default companyRouters;
