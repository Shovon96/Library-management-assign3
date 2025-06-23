import mongoose, { Schema, model } from 'mongoose';

const borrowSchema = new Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, "The Book Id feild is required"]
    },
    quantity: {
        type: Number,
        required: [true, "The Borrow quantity is required"],
        min: [0, "Not allowed the negative numbers"],
    },
    dueDate: {
        type: Date,
        required: [true, "The Due Date is required"]
    }
},
    {
        versionKey: false,
        timestamps: true
    }
);

export const Borrow = model('Borrow', borrowSchema);