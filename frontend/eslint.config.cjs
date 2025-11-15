/**
 * ESLint flat config for the frontend.
 * Minimal, safe configuration that enables TypeScript and React linting.
 */
module.exports = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        // Keep project off for config files; enable for src override below
        project: undefined,
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      react: require("eslint-plugin-react"),
      "react-hooks": require("eslint-plugin-react-hooks"),
      "jsx-a11y": require("eslint-plugin-jsx-a11y"),
      import: require("eslint-plugin-import"),
    },
    settings: {
      react: { version: "detect" },
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      // Base
      "no-console": "warn",
      "no-debugger": "error",

      // React
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",

      // TypeScript rules (use warnings to avoid failing CI on first pass)
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",

      // Import
      "import/no-unresolved": "off",
    },
  },
  {
    // Specific TypeScript overrides for source files that need type-aware rules
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: { project: "./tsconfig.json" },
    },
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
]
