"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    testMode: process.env.TEST_MODE === 'true',
    port: process.env.PORT || 3000,
};
