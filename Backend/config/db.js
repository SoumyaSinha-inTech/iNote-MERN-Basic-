const mongoose = require("mongoose");

const mongooseConnect = () => {
    mongoose.connect(process.env.MONGOOSE_URI)
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.log("MongoDB connection error:", err);
        });
};

module.exports = mongooseConnect;