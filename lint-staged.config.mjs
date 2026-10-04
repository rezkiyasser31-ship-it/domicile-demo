export default {
  "*.{js,jsx,ts,tsx,mjs,mts}": ["npx eslint --fix", "npx prettier --write"],
  "*.{json,md,css}": ["npx prettier --write"],
};
