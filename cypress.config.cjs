const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
    e2e: {
        testIsolation: true,
        baseUrl: process.env.BASE_URL,
    },
    env: {
        loginUsername: process.env.TEST_LOGIN_USERNAME,
        loginPassword: process.env.TEST_LOGIN_PASSWORD
    }
});
