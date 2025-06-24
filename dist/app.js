"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controllar_1 = require("./app/controllar/books.controllar");
const borrow_controllar_1 = require("./app/controllar/borrow.controllar");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use('/api/books', books_controllar_1.booksRoute);
app.use('/api/borrow', borrow_controllar_1.borrowRoute);
// If any routes are not matched.
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'API route not found',
    });
});
app.get('/', (req, res) => {
    res.send("Wellcome to the Library");
});
exports.default = app;
