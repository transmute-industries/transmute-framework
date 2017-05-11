"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LocalStorage_1 = require("./LocalStorage/LocalStorage");
exports.Persistence = {
    getItem: LocalStorage_1.getItem,
    setItem: LocalStorage_1.setItem
};
