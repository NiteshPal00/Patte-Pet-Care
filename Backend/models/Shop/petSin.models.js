import mongoose from "mongoose";

const Schema = mongoose.Schema;

const petSinmodels = new Schema({
    
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
    createdAt:{
        type: Date,
        default: Date.now()
    },
    status:{
        type: Number,
        default: 1
    }
})

export default mongoose.model("petShopsSin", petSinmodels);
