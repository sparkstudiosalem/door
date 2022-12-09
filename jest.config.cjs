module.exports = {
  transform: {
    "^.+\\.(t|j)s$": ["@swc/jest"],
  },
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/build/"],
};
