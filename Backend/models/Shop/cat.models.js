import mongoose from "mongoose";

const Schema = mongoose.Schema;

const catModels = new Schema({
    
    title:{
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
    discount:{
        type: Number,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    priceCut:{
        type: Number,
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

export default mongoose.model("CatShops", catModels);
