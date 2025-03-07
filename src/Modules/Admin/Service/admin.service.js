import CompanyModel from "../../../DB/Models/company.model.js";
import UserModel from "../../../DB/Models/users.model.js";

// Ban or unbanned specific user
export const banUserService = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "user not found" });
  if (user.bannedAt) {
    await UserModel.updateOne({ email }, { $unset: { bannedAt: 1 } });
    return res.status(200).json({ message: "user unbanned successfully" });
  }
  user.bannedAt = new Date();
  await user.save();
  res.status(200).json({ message: " user banned successfully" });
};

// Ban or unbanned specific company
export const banCompanyService = async (req, res) => {
  const { companyEmail } = req.body;
  const company = await CompanyModel.findOne({ companyEmail });
  if (!company) return res.status(404).json({ message: "company not found" });
  if (company.bannedAt) {
    await CompanyModel.updateOne({ companyEmail }, { $unset: { bannedAt: 1 } });
    return res.status(200).json({ message: "company unbanned successfully" });
  }
  company.bannedAt = new Date();
  await company.save();
  res.status(200).json({ message: " Company banned successfully" });
};

// approve company service
export const approveCompanyService = async (req, res) => {
  const { companyEmail } = req.body;
  const company = await CompanyModel.findOne({ companyEmail });
  if (!company) return res.status(404).json({ message: "company not found" });
  if (company.approvedByAdmin)
    return res.status(400).json({ message: "company already approved" });
  company.approvedByAdmin = true;
  await company.save();
  res.status(200).json({ message: `yor company is approved by the admin` });
};
