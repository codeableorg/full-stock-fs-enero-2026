import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
  files: ["**/*.{js,ts}"],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    {
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
          ...globals.node,
          ...globals.browser,
        },
      },
      rules: {
        "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_" },
        ],
        "prefer-const": "error",
        eqeqeq: ["error", "always"],
      },
    },
  ],
});
