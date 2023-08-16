const mongoose = require('mongoose');
const DATA_BASE = "mongodb+srv://dkingg8803:Dhruvil@cluster0.qggn9xd.mongodb.net/Shipmnts?retryWrites=true&w=majority";
const connect = ()=>{
mongoose.connect(DATA_BASE,{
        useNewUrlParser:true,
        useUnifiedTopology: true
}).then(()=>{
    console.log("Connection Successfull");
})
.catch((e)=>{
console.log("Fail to connect to database");
console.log(e);
})
}

module.exports = connect;