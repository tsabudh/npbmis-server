import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node, // ✅ Correct environment for Node.js
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {},
    rules: {
      ...js.configs.recommended.rules, // ✅ Includes "no-undef"
      "no-undef": "error", // ✅ Flags undefined variables as errors
      "no-unused-vars": "error", // ✅ Prevents unused variables
      strict: ["error", "global"], // ✅ Enforces strict mode globally
    },
  },
];
