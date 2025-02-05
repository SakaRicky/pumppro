import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	verbose: true,
	forceExit: true,
	transform: {
		"^.+\\.(ts|tsx)?$": "ts-jest",
		"^.+\\.(js|jsx)$": "babel-jest"
	},
	setupFilesAfterEnv: ["<rootDir>/test-setup.ts"],
	globalTeardown: "<rootDir>/teardown.ts",
	testNamePattern: "users"
};

export default config;
