const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema;

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    desc:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:false
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    category:{
        type:Array,
        required:false
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
            {
                text: String,
                created: { type: Date, default: Date.now },
                postedBy: {
                    type: ObjectId,
                    ref: "User",
                },
            },
        ],
}, {timestamps:true})

module.exports = mongoose.model('Post', PostSchema)