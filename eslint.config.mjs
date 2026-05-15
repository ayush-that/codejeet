import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      ".open-next/**",
      "next-env.d.ts",
      "scraper/**",
      "lib/learn/generated.ts",
      "content/learn/**",
    ],
  },
];

export default eslintConfig;
