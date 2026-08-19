const mongoose=require('mongoose');
const notesSchema= mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    tags:{
        type:String
    },
    date:{
        type:String,
        default:Date.now
    }
})
module.exports=mongoose.model('notes',notesSchema)