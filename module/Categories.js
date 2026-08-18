import mongoose from "mongoose";

const Categories = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    numOfBooks:{
        type: Number,
        required: true,
        default: 0
    }
});
export default mongoose.model('Category' , Categories);