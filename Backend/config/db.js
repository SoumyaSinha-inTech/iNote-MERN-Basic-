const mongoose = require('mongoose');

const mongooseConnect=()=>{
    mongoose.connect(process.env.MONGOOSE_URI)
}
module.exports=mongooseConnect;

