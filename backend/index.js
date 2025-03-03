const express = require('express');
const app = express();
const dotEnv = require('dotenv');
const Mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const studentRoutes = require('./routes/studentRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());

dotEnv.config();

Mongoose.connect(process.env.Mongo_URI)
    .then(() => {
        console.log("MongoDB is Connected Succesfully");
    })
    .catch((error) => {
        console.log(error);
    })


app.use(bodyParser.json());
app.use('/student',studentRoutes);

app.listen(PORT, () => {
    console.log(`Serve is running at ${PORT}`);
});

// app.use('/',(req,res)=>{
//     res.send("<h1>Welcome To BrightLearn");
// })