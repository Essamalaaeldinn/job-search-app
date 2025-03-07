import CompanyModel from "../../../DB/Models/company.model.js";
import mongoose from "mongoose";
import fs from "fs";

// Add Company
export const addCompanyService = async (req, res) => {
  try {
    const {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      CreatedBy,
      HRs,
    } = req.body;

    const isCompanyEmailExist = await CompanyModel.findOne({ companyEmail });
    if (isCompanyEmailExist)
      return res.status(409).json({ message: "Company email already exists" });

    const isCompanyNameExist = await CompanyModel.findOne({ companyName });
    if (isCompanyNameExist)
      return res.status(409).json({ message: "Company name already exists" });

    await CompanyModel.create({
      companyName,
      companyEmail,
      description,
      industry,
      address,
      numberOfEmployees,
      CreatedBy,
      HRs,
    });

    res.status(200).json({ message: "Company created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



// Update Company Data
export const updateCompanyService = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { companyName, description, industry, address, numberOfEmployees, HRs } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - User not authenticated" });
    }

    const company = await CompanyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.CreatedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this company" });
    }

    company.companyName = companyName || company.companyName;
    company.description = description || company.description;
    company.industry = industry || company.industry;
    company.address = address || company.address;
    company.numberOfEmployees = numberOfEmployees || company.numberOfEmployees;
    company.HRs = HRs || company.HRs;

    await company.save();

    res.status(200).json({ message: "Company updated successfully", company });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Soft Delete Company
export const softDeleteCompanyService = async (req, res) => {
  try {
    const { companyId } = req.params;
    const userId = req.user._id;

    const company = await CompanyModel.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    if (company.CreatedBy.toString() !== userId && !req.user.isAdmin)
      return res.status(403).json({ message: "You are not authorized to delete this company" });

    company.isDeleted = true;
    await company.save();

    res.status(200).json({ message: "Company soft deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Specific Company with Related Jobs
export const getCompanyWithJobsService = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await CompanyModel.findById(companyId).populate("jobs");
    if (!company) return res.status(404).json({ message: "Company not found" });

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Search for a Company
export const searchCompanyService = async (req, res) => {
  try {
    const { name } = req.query;
    const companies = await CompanyModel.find({
      companyName: { $regex: name, $options: "i" },
    });

    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Upload Company Logo
export const uploadLogoService = async (req, res) => {
  try {
    const { companyId } = req.params;
    const logo = req.file;

    if (!logo) return res.status(400).json({ message: "Logo is required" });

    const company = await CompanyModel.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    company.logo = logo.path;
    await company.save();

    res.status(200).json({ message: "Logo uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Upload Company Cover Pic
export const uploadCoverPicService = async (req, res) => {
  try {
    const { companyId } = req.params;
    const coverPic = req.file;

    if (!coverPic) return res.status(400).json({ message: "Cover pic is required" });

    const company = await CompanyModel.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    company.coverPic = coverPic.path;
    await company.save();

    res.status(200).json({ message: "Cover pic uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Company Logo
export const deleteLogoService = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await CompanyModel.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    if (company.logo) {
      fs.unlinkSync(company.logo);
      company.logo = null;
      await company.save();
    }

    res.status(200).json({ message: "Logo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Company Cover Pic
export const deleteCoverPicService = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await CompanyModel.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    if (company.coverPic) {
      fs.unlinkSync(company.coverPic);
      company.coverPic = null;
      await company.save();
    }

    res.status(200).json({ message: "Cover pic deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};