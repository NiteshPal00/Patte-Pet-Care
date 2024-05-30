import mongoose from "mongoose";

const Schema = mongoose.Schema;

const allShopModels = new Schema({
    
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
        default: null
    },
    price:{
        type: Number,
        required: true,
    },
    priceCut:{
        type: Number,
        default: null
    },
    category:{
        type: String,
        required: true
    },
    star:{
        type: Number,
        required: true
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

export default mongoose.model("allShops", allShopModels);
