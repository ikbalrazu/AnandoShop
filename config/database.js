const mongoose = require('mongoose');

const connectDatabase = async() => {
    //console.log("mongo url: ",process.env.MONGO_URL);
    mongoose.set('strictQuery', true);

    mongoose.connect(process.env.MONGO_URL).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
    // try{
    //     const conn = await mongoose.connect(process.env.MONGO_URL,{
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //     });
    //     console.log(`MongoDB Connected: ${conn.connection.host}`);
    // }catch(error){
    //     console.log(`Error: ${error.message}`);
    //     process.exit();
    // }

}

module.exports = connectDatabase;