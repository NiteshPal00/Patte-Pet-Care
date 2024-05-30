import mongoose from "mongoose";
import allShopModels from "./Shop/allShop.models";
import userModals from "./user.modals";

const Schema = mongoose.Schema;

const CartSchema = new Schema({

  productID:{
    type:Schema.Types.ObjectId,
    required:true,
    ref : allShopModels,
  },
  userID:{
    type:Schema.Types.ObjectId,
    required:true,
    ref : userModals,

  },
  name:{
    type:String,
    required:true
  },
  image:{
    type:String,
    default:null
  },
  price:{
    type:Number,
    required:true
  },
  quantity:{
    type:Number,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: Number,
    default: 1
  }
  
});

export default mongoose.model('cart',CartSchema);
