"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoute = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const books_model_1 = require("../model/books.model");
const borrow_model_1 = require("../model/borrow.model");
const handle_error_1 = require("../utilities/handle.error");
exports.borrowRoute = express_1.default.Router();
// Borrow fields zod validation
const borrowZodSchema = zod_1.z.object({
    book: zod_1.z.string(),
    quantity: zod_1.z.number(),
    dueDate: zod_1.z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid due date format"
    })
});
// POST a borrow
exports.borrowRoute.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = yield borrowZodSchema.parseAsync(req.body);
        ;
        // Find the book
        const findBook = yield books_model_1.Books.findById(book);
        if (!findBook) {
            res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        // Check if enough copies are available
        if (findBook.copies < quantity) {
            res.status(400).json({
                success: false,
                message: 'Not enough book copies available'
            });
        }
        // Reduce the book copies
        findBook.copies -= quantity;
        if (findBook.copies === 0) {
            findBook.available = false;
        }
        // Save updated book info
        yield findBook.save();
        // Create new borrow record
        const borrowRecord = yield borrow_model_1.Borrow.create({ book, quantity, dueDate });
        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: borrowRecord
        });
    }
    catch (error) {
        console.log("Error from borrow post route:", error);
        (0, handle_error_1.handleError)(res, error);
    }
}));
// Get all borrow with quantity and name
exports.borrowRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrow = yield borrow_model_1.Borrow.aggregate([
            {
                // step-1
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {
                $unwind: "$book"
            },
            // step-2
            {
                $group: {
                    _id: "$book.title",
                    isbn: { $first: "$book.isbn" },
                    totalQuantity: { $sum: "$quantity" },
                }
            },
            // step-3
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$_id",
                        isbn: "$isbn"
                    },
                    totalQuantity: 1
                }
            }
        ]);
        res.status(201).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: borrow
        });
    }
    catch (error) {
        console.log("Error from borrow get route:", error);
        (0, handle_error_1.handleError)(res, error);
    }
}));
