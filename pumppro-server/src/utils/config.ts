import dotenv from "dotenv";
import path from 'path';

let envPath: string;

if (process.env.NODE_ENV === "test") {
	envPath = path.resolve(__dirname, '../../.env.test.local');
} else if (process.env.NODE_ENV === "development") {
    envPath = path.resolve(__dirname, '../../.env.dev');
} else {
    envPath = path.resolve(__dirname, '../../.env.prod');
}

const dotenvResult = dotenv.config({ path: envPath, override: true });

if (dotenvResult.error) {
    console.warn(`Warning: dotenv could not load file ${envPath}: ${dotenvResult.error.message}`);
} else {
    console.log(`dotenv loaded environment variables from: ${envPath}`);
}

interface Config {
	PORT: string | number;
	DATABASE_URL: string | undefined;
	SECRET: string | undefined;
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
	SECRET: process.env.SECRET,
	SESSION_SECRET: process.env.SESSION_SECRET ?? "",
	JWT_SECRET: process.env.JWT_SECRET ?? "",
	CLOUDINARY_CONFIG: {
		CLOUDINARY_URL: process.env.CLOUDINARY_URL ?? "",
		CLOUDINARY_APIKEY: process.env.CLOUDINARY_APIKEY ?? "",
		CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? ""
	}
};

console.log('config:', config);

export default config;
