import "dotenv/config";
import dotenv from "dotenv";

delete process.env.DATABASE_URL; // Ensure it's not set before loading dotenv

dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : process.env.NODE_ENV === "development" ? ".env.dev" : ".env" });

type Config = {
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
};


const config: Config = {
	PORT: process.env.PORT || 5000,
	DATABASE_URL: process.env.DATABASE_URL,
	SECRET: process.env.SECRET,
	SESSION_SECRET: process.env.SESSION_SECRET || "",
	JWT_SECRET: process.env.JWT_SECRET || "",
	CLOUDINARY_CONFIG: {
		CLOUDINARY_URL: process.env.CLOUDINARY_URL || "",
		CLOUDINARY_APIKEY: process.env.CLOUDINARY_APIKEY || "",
		CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || ""
	}
};

console.log("Connected to the database: ", config.DATABASE_URL);

export default config;
