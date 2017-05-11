"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const local_storage_fallback_1 = require("@conclurer/local-storage-fallback");
let store = new local_storage_fallback_1.FallbackStorage();
exports.getItem = (key) => {
    return new Promise((resolve, reject) => {
        let itemAsString = store.getItem(key);
        try {
            resolve(JSON.parse(itemAsString));
        }
        catch (e) {
            resolve(itemAsString);
        }
    });
};
exports.setItem = (key, value) => {
    return new Promise((resolve, reject) => {
        store.setItem(key, JSON.stringify(value));
        resolve(value);
    });
};
