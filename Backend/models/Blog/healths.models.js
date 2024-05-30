import mongoose from "mongoose";

const Schema = mongoose.Schema;

const healthSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    button:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
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

export default mongoose.model("AllBlog's", healthSchema);
