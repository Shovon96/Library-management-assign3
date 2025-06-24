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
exports.booksRoute = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const books_model_1 = require("../model/books.model");
const handle_error_1 = require("../utilities/handle.error");
exports.booksRoute = express_1.default.Router();
// Book fields Zod validation
const booksZodSchema = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    genre: zod_1.z.string(),
    isbn: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number(),
    available: zod_1.z.boolean().optional()
});
// Error Handle
// const handleError = (res: Response, error: any) => {
//     res.status(400).json({
//         success: false,
//         message: error.message || 'Something went wrong',
//         error: error
//     });
// };
// Create a book
exports.booksRoute.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const body = req.body;
        const body = yield booksZodSchema.parseAsync(req.body);
        const book = yield books_model_1.Books.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        });
    }
    catch (error) {
        console.log("Error from book post route", error);
        (0, handle_error_1.handleError)(res, error);
    }
}));
// Get all the books
exports.booksRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Queries
        const filter = req.query.filter;
        const sortBy = req.query.sortBy || 'createdAt';
        const sort = req.query.sort === 'asc' ? 1 : -1;
        const limit = parseInt(req.query.limit) || 10;
        // Filter
        const query = {};
        if (filter) {
            query.genre = filter.toUpperCase();
        }
        // sort and limit
        const books = yield books_model_1.Books.find(query)
            .sort({ [sortBy]: sort })
            .limit(limit);
        res.status(201).json({
            success: true,
            message: "Books retrieved successfully",
            data: books
        });
    }
    catch (error) {
        console.log("Error from get all books route", error);
        (0, handle_error_1.handleError)(res, error);
    }
}));
// Get a Specific book using by ID
exports.booksRoute.get('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield books_model_1.Books.findById(bookId);
        res.status(201).json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        });
    }
    catch (error) {
        console.log("Error from get specific book by ID route", error);
        (0, handle_error_1.handleError)(res, error);
    }
}));
// Update a Specific book any data using by ID
// For 'PATCH' route: update any field using by partial()
const updateBookZodSchema = booksZodSchema.partial();
exports.booksRoute.patch('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updatedBody = yield updateBookZodSchema.parseAsync(req.body);
        const copiesNumber = updatedBody.copies;
        if (copiesNumber === undefined || copiesNumber > 0) {
            const updatedBook = yield books_model_1.Books.findByIdAndUpdate(bookId, updatedBody, { new: true });
            res.status(201).json({
                success: true,
                message: "Book updated successfully",
                data: updatedBook
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "Not allowed the negative numbers",
                data: copiesNumber
            });
        }
    }
    catch (error) {
        console.log("Error from update specific book by ID route", error);
        (0, handle_error_1.handleError)(res, error);
    }
}));
// Delete a specific book using by ID from the database
exports.booksRoute.delete('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const deleteBook = yield books_model_1.Books.findByIdAndDelete(bookId);
        res.status(201).json({
            success: true,
            message: "Book deleted successfully",
            data: null
        });
    }
    catch (error) {
        console.log("Error from delete a specific book route", error);
        (0, handle_error_1.handleError)(res, error);
    }
}));
