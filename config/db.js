const mongoose = require('mongoose')


const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
        //current URL string parser is deprecated, and will be removed in a future version
        //ek baar docs refer karna meko inta knowledge nahi h
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`);
};
module.exports = connectDB;