module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "airbnb-base",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        ".eslintrc.{js,cjs}",
        "*.js",
      ],
      parserOptions: {
        ecmaVersion: "2021",
        sourceType: "module",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "2021",
    sourceType: "module",
  },
  plugins: ["import"],
  rules: {
    "linebreak-style": 0,
    quotes: ["error", "double"],
    "import/extensions": [
      "error",
      "always",
      {
        js: "always",
      },
    ],

  },
};
