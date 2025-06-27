import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from './routes/user.route.js';
//route declaration
app.use('/api/v1/users', userRouter);    //get is not used here as all the files are seperated into different files(not at a single place)

export {app};