import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import globals from "globals";

export default defineConfig([
  ...nextVitals,
  {
    files: [
      "scripts/**/*.{js,mjs,cjs}",
      "tests/**/*.{ts,tsx}",
      "*.config.{js,mjs,cjs,ts,mts}",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // These React Compiler-era rules flag existing patterns across the app.
    // Keep them visible as warnings until the Phase 2 hook refactor.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
    "public/**",
    "data/**",
  ]),
]);
