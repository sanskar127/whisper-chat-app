import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const App = express();
const server = createServer(App);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId; // Ensure userId is correctly retrieved

  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
    console.log("a user connected", userId);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("newMessage", ({ receiver, content }) => {
    const receiverSocketId = getReceiverSocketId(receiver);
    if (receiverSocketId) {
      const newMessage = {
        sender: userId,
        receiver,
        content,
      };

      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { App, io, server, express };
