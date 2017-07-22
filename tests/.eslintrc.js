module.exports = {
  env: {
    embertest: true
  },
  globals: {
    fillInFroalaEditor: true
  },
  rules: {
    "no-unused-vars": ["error", { "varsIgnorePattern": "fillInFroalaEditor" }]
  }
};
