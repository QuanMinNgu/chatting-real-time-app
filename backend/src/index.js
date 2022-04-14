const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const http = require('http').createServer(app);
const io = require('socket.io')(http);

let users = [];
io.on("connect",socket => {
    

    socket.on("joinRoom",id =>{
        const user = {name:id.name,socketId : socket.id};

        const check = users.every(item => item.socketId !== socket.id);
        if(check){
            users.push(user);
        }
        socket.emit("getUser",{users});
        users.forEach(item => {
            if(item.socketId !== socket.id){
                socket.to(`${item.socketId}`).emit("getUser",{users});
            }
        });
    });


    socket.on("sendChat",id => {
        socket.emit("getChat",{content:id.content,name:id.user});
        socket.to(`${id.username}`).emit("getChat",{content:id.content,name:id.user});
    });


    socket.on("disconnect", () => {
        users = users.filter(user => user.socketId !== socket.id);
    })
})

http.listen(5000 ,() => console.log("Connected to port 5000"));