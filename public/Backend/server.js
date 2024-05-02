import express from "express";
import http from "http";
import socketIO from "socket.io";

const app = express();

const httpServer = http.createServer(app);
const socketServer = socketIO(httpServer, {
    cors: {
        origin: '*'
    }
})

app.use(express.json);
