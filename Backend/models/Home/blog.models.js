import mongoose from "mongoose";

const Schema = mongoose.Schema;

const blogModels = new Schema({
    imgHeader : {
        type: String,
        required: null,
    },
    image:{
        type: String,
        default: null
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

export default mongoose.model("blogHome", blogModels);

