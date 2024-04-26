import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors';
import path from 'path'

import authRoute from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'
import userRoute from './routes/user.route.js'
import connectToMongoDB from './db/connectToMongoDB.js';
import { app, server } from './socket/socket.js';

// Allow requests only from your frontend domain
// const allowedOrigins = ['https://myfrontend.com', 'http://localhost:3000']; // Add more as needed

// app.use(cors({
//   origin: function (origin, callback) {
//     // Check if the request origin is in the allowed list
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true, // Allow cookies to be sent
// }));

const __dirname = path.resolve()

const corsOption = {
    origin: ['http://localhost:3000', 'https://randomchatapp.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true,
}

app.use(cors(corsOption));
dotenv.config();
const PORT = process.env.PORT || 5000; //without dotenv package it will give 5000
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);
app.use("/api/users", userRoute);


// app.use(express.static(path.join(__dirname,"/frontend/build")))
app.get("*", (req, res) =>{
    res.send()
} )

server.listen(PORT, () => {
    connectToMongoDB();
    console.log("runnning on", PORT);
})
