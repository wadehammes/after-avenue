import type { Config } from "stylelint";

export default {
  extends: ["stylelint-config-standard", "stylelint-config-css-modules"],
  plugins: ["stylelint-value-no-unknown-custom-properties"],
  rules: {
    "block-no-empty": true,
    "csstools/value-no-unknown-custom-properties": [
      true,
      {
        importFrom: [
          "src/styles/variables.css",
          "src/styles/runtime-variables.json",
        ],
      },
    ],
    "keyframes-name-pattern": null,
    "selector-class-pattern": null,
  },
} satisfies Config;
