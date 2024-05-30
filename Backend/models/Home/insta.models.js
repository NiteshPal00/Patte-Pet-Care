import mongoose from "mongoose";

const Schema = mongoose.Schema;

const instaModels = new Schema({
    images: {
        type: Array,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        default: 1
    }
})

export default mongoose.model("insta", instaModels);
