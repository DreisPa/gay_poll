const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.static('public'));

let votes = {
    yes: 0,
    no: 0
};

io.on('connection', (socket) => {
    console.log('New client connected');

    // Отправляем текущие голоса клиенту
    socket.emit('updateVotes', votes);

    socket.on('vote', (vote) => {
        if (vote === 'yes') {
            votes.yes++;
        } else if (vote === 'no') {
            votes.no++;
        }
        // Отправляем обновленные голоса всем клиентам
        io.emit('updateVotes', votes);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


