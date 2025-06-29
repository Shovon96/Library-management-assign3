import { Model, model, Schema } from "mongoose";
import { IBooks } from "../interface/books.interface";

const booksSchema = new Schema<IBooks>(
    {
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
                message:
                    "The Genre must be choose of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
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
    },
    {
        versionKey: false,
        timestamps: true
    }
)

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

// Static Method for check availablity
interface BookModel extends Model<IBooks> {
    updateAvailability(bookId: string): Promise<void>;
}

booksSchema.statics.updateAvailability = async function (bookId: string) {
    const book = await this.findById(bookId);
    if (book && book.copies === 0) {
        book.available = false;
        await book.save();
    }
};

export const Books = model<IBooks, BookModel>('Book', booksSchema);