module.exports = {
    extends: ["@lusito/eslint-config-react"],
    rules: {
        "react-hooks/exhaustive-deps": "error",
    },
    env: {
        browser: true,
    },
};
