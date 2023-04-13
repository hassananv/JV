import * as dotenv from "dotenv";

let path;
switch (process.env.NODE_ENV) {
  case "test":
    path = `.env.test`;
    break;
  case "production":
    path = `.env.production`;
    break;
  default:
    path = `.env.development`;
}
dotenv.config({ path: path });

export const API_PORT = parseInt(process.env.API_PORT || "3000");
export const FRONTEND_URL = process.env.FRONTEND_URL || "";
export const AUTH_REDIRECT = process.env.AUTH_REDIRECT || process.env.FRONTEND_URL || "";
export const NODE_ENV = process.env.NODE_ENV;
export const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export const DB_NAME = process.env.DB_NAME || "postgres";
export const DB_USER = process.env.DB_USER || "postgres";
export const DB_PASS = process.env.DB_PASS || "password";
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = process.env.DB_PORT || "5432";
export const DB_SCHEMA = process.env.DB_SCHEMA || "dbo";

export const AZURE_KEY = process.env.AZURE_KEY || "";

export const DB_CONFIG = {
	client: 'postgres',
	connection: {
		host: DB_HOST,
		user: DB_USER,
		password: DB_PASS,
		database: DB_NAME,
		port: parseInt(DB_PORT),
	},
};
