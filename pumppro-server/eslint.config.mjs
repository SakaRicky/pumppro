// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommendedTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname
			}
		}
	},
	{
		ignores: [
			"node_modules/",
			"dist/",
			"public/",
			"coverage/",
			"*.config.js", // Can ignore explicitly if preferred over targeted config
			"*.config.mjs"
		]
	}
);
