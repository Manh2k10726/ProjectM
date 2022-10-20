import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';
// import cors from 'cors';

require('dotenv').config();

let app = express();
// app.use(cors({origin:true}));
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin',process.env.URL_REACT);
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH,OPTION');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-with,content-type');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();
});
//config app

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ limit:'50mb',extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;
//Port === undefined => port = 6969

app.listen(port, () => {
    //callback
    console.log("Backend Nodejs is running on the port : " + port)
})