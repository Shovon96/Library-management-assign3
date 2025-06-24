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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Books = void 0;
const mongoose_1 = require("mongoose");
const booksSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'The book Title is required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'The Author name is required'],
        trim: true
    },
    genre: {
        type: String,
        required: [true, 'The Genre is required'],
        enum: {
            values: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
            message: "The Genre must be choose of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
        },
        uppercase: true,
        trim: true
    },
    isbn: {
        type: String,
        required: [true, 'The ISBN is required'],
        unique: [true, "The ISBN number need to unique"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    copies: {
        type: Number,
        required: [true, "The book Copies feild is required"],
        min: [0, "Not allowed the negative numbers"],
        trim: true
    },
    available: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});
// Pre-save middleware: title & author trim
booksSchema.pre('save', function (next) {
    this.title = this.title.trim();
    if (this.author) {
        this.author = this.author.trim();
    }
    // Update available
    this.available = this.copies > 0;
    console.log('Pre-save: book data cleaned & availability set');
    next();
});
// Post-save middleware: for book creation
booksSchema.post('save', function (doc) {
    console.log(`${doc.title} Book  saved successfully in ${doc.genre} gener`);
});
booksSchema.statics.updateAvailability = function (bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield this.findById(bookId);
        if (book && book.copies === 0) {
            book.available = false;
            yield book.save();
        }
    });
};
exports.Books = (0, mongoose_1.model)('Book', booksSchema);
