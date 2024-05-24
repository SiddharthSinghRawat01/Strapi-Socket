'use strict';

const { Server } = require('socket.io');
const axios = require('axios');

module.exports = {
  register({ strapi }) {},

  async bootstrap({ strapi }) {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected", socket.id);

      socket.on("join", ({ username }) => {
        console.log("Username is", username);
        if (username) {
          socket.join("group");
          socket.emit("welcome", {
            user: "bot",
            text: `${username}, Welcome to the group chat`,
            userData: username,
          });
        } else {
          console.log("An error occurred");
        }
      });

      socket.on("sendMessage", async (data) => {
        const strapiData = {
          data: {
            user: data.user,
            message: data.message,
          },
        };

        try {
          await axios.post("http://localhost:1337/api/messages", strapiData);
          socket.broadcast.to("group").emit("message", {
            user: data.user,
            text: data.message,
          });
        } catch (error) {
          console.log("Error", error.message);
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
      });
    });

    console.log('Socket.io server is running...');
    strapi.io = io;
  },
};
