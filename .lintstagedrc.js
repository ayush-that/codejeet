module.exports = {
  "*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}": ["oxfmt --write", "oxlint --deny-warnings"],
  "*.{json,css,scss,md}": ["oxfmt --write"],
};
