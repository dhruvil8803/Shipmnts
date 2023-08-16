const express = require('express');
const app = express();
const connect = require("./db");
const bodyParser = require("body-parser");

connect();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/api/users", require('./Routes/UserCRUD.js'));
const port = 5000;
app.listen(port, ()=>{
 console.log("Listening to Port 5000");
})