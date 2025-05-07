import dotenv from "dotenv";
import path from 'path';
import fs from 'fs';

if (process.env.NODE_ENV !== 'production') {
	const envFileName = process.env.NODE_ENV === 'test'
		? '.env.test'
		: '.env.dev';

	const projectRoot = process.cwd();
	console.log("🚀 ~ projectRoot:", projectRoot)
	const envPath = path.resolve(projectRoot, envFileName);

	// Check if the local .env file exists before trying to load it
	if (fs.existsSync(envPath)) {
		console.log(`Local environment detected. Loading environment variables from: ${envPath}`);
		dotenv.config({ path: envPath });
	} else {
		console.warn(`Warning: Local environment file ${envPath} not found. Using default environment variables.`);
	}
} else {
	// In production (on Render), rely solely on variables set by the host environment
	console.log('Production environment detected. Using system environment variables provided by host.');
}

interface Config {
	PORT: string | number;
	DATABASE_URL: string | undefined;
	SESSION_SECRET: string;
	JWT_SECRET: string;
	CLOUDINARY_CONFIG: {
		CLOUDINARY_URL: string;
		CLOUDINARY_APIKEY: string;
		CLOUDINARY_API_SECRET: string;
	};
}

const config: Config = {
	PORT: process.env.PORT ?? 5000,
	DATABASE_URL: process.env.DATABASE_URL,
	SESSION_SECRET: process.env.SESSION_SECRET ?? "",
	JWT_SECRET: process.env.JWT_SECRET ?? "",
	CLOUDINARY_CONFIG: {
		CLOUDINARY_URL: process.env.CLOUDINARY_URL ?? "",
		CLOUDINARY_APIKEY: process.env.CLOUDINARY_APIKEY ?? "",
		CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? ""
	}
};

export default config;
