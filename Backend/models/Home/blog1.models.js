import mongoose from "mongoose";

const Schema = mongoose.Schema;

const blog1Model = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: null
    },
    imgTitle: {
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    status:{
        type: Number,
        default: 1
    }
}) 

export default mongoose.model("blogs1", blog1Model)