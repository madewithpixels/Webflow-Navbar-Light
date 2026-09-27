import eslint from "@eslint/js";
import promise from "eslint-plugin-promise";
import tseslint from "typescript-eslint";

/** Type-aware rules only run for sources included in tsconfig.json (see include). */
const typeCheckedFiles = ["src/**/*.ts", "src/**/*.tsx"];

export default tseslint.config(
  { ignores: ["public/bundle.js", "public/bundle.js.LICENSE.txt"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: typeCheckedFiles,
  })),
  {
    files: typeCheckedFiles,
    plugins: {
      promise,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
      "@typescript-eslint/no-unused-vars": "error",
      "no-async-promise-executor": "error",
      "require-await": "error",
      "promise/catch-or-return": "error",
    },
  }
);
