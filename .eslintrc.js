module.exports = {
    "env": {
        "es6": true,
        "node": true,
    },
    "extends": ["eslint:recommended", "plugin:node/recommended"],
    "plugins": ["node"],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "valid-jsdoc": [
            "error",
            {
                "requireParamDescription": false,
                "requireReturnDescription": false,
            }
        ],
        "no-sync": [
            "warn"
        ],
        "no-var": [
            "error",
        ],
        "prefer-arrow-callback": [
            "error",
        ],
        "prefer-const": [
            "error",
        ],
        "consistent-return": [
            "error",
        ],
    }
};