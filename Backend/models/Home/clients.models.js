import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const clientSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    header:{
        type: String,
        required: true
    },
    description:{
        type: String,
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

export default mongoose.model("clientsay", clientSchema);