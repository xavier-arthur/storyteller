"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PermissionError extends Error {
    constructor(msg = '') {
        super(msg);
        this.name = 'PermissionError';
    }
}
exports.default = PermissionError;
