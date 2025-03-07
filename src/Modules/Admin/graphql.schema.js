import { gql } from 'graphql';
import UserModel from '../../DB/Models/users.model.js';
import CompanyModel from '../../DB/Models/company.model.js';
import jwt from 'jsonwebtoken';
import BlackListTokensModel from '../../DB/Models/blackedListTokens.model.js';
import { roles } from '../../Constants/constants.js';

// Define the GraphQL schema
export const typeDefs = gql`
  type User {
    id: ID!
    firstName: String
    lastName: String
    userName: String
    email: String
    gender: String
    DOB: String
    phone: String
    role: String
    isConfirmed: Boolean
    deletedAt: String
    bannedAt: String
  }

  type Company {
    id: ID!
    companyName: String
    description: String
    industry: String
    address: String
    numberOfEmployees: String
    companyEmail: String
    createdBy: ID
    approvedByAdmin: Boolean
    bannedAt: String
    deletedAt: String
  }

  type AdminDashboard {
    users: [User!]!
    companies: [Company!]!
  }

  type Query {
    adminDashboard: AdminDashboard!
  }
`;

// Authentication and authorization helper
async function authenticateAndAuthorize(headers) {
  const accesstoken = headers.accesstoken;
  if (!accesstoken) throw new Error('Access token required');

  const decodedData = jwt.verify(accesstoken, process.env.JWT_ACCESS_TOKEN);
  const isTokenBlackListed = await BlackListTokensModel.findOne({ tokenId: decodedData.jti });
  if (isTokenBlackListed) throw new Error('Token expired, please log in again');

  const user = await UserModel.findById(decodedData._id);
  if (!user || user.deletedAt || user.bannedAt) throw new Error('User not found or banned');

  if (!roles.ADMIN === user.role) throw new Error('Unauthorized: Admin access only');

  return user;
}

// Define resolvers
export const resolvers = {
  Query: {
    adminDashboard: async (_, __, { req }) => {
      await authenticateAndAuthorize(req.headers); // Ensure admin access
      const users = await UserModel.find({ deletedAt: null }).select('-password -otp -__v');
      const companies = await CompanyModel.find({ deletedAt: null }).select('-__v');
      return { users, companies };
    }
  },
  User: {
    userName: (parent) => `${parent.firstName} ${parent.lastName}`, // Virtual field
    phone: (parent) => require('../../Utils/crypto.utils.js').decryption(parent.phone, process.env.SECRET_KEY)
  }
};