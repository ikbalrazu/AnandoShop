const app = require('./app');
const connectDatabase = require('./config/database');

let enviroment = 'development'


//Setting up config file
if(enviroment === 'production') {
    require('dotenv').config({path: '.env'});
}else{
    require('dotenv').config({path: 'config/config.env'});
}


//Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})

//Handle Uncaught exceptions
process.on('uncaughtException',(err)=>{
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
    
    server.close(()=>{
        process.exit(1);
    });
    
});
