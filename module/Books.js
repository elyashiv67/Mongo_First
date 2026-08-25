import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const Books = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    category: {
        type: ObjectId,
        required: true,
        ref: 'Category',
    },
    date_taken:{
        type: Date,
        required: true,
        default: Date.now,
    },
    date_back: {
        type: Date,
        required: false,
        default: null,
    },
    isTaken: {
        type: Boolean,
        required: true,
        default: false,
    }
},
    { timestamps: true });

export default mongoose.model('Book', Books);