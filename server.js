// internal libraries
const path = require('path');
const http = require('http');

// external libraries
const express = require('express');
const socketio = require('socket.io');
const dotenv = require('dotenv');

// import from utils
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');

// configuring config path
dotenv.config({ path: './config/config.env' });

// import from helpers
const file = require('./helper/writeToFile');
const mail = require('./helper/sendMail');
const sms = require('./helper/sendSMS');

// creating the app
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));



const botName = 'WebSpiders Bot';

// run when a client connects
io.on('connection', socket => {

    socket.on('joinRoom', ({username, email, phone, message}) => {

        const user = userJoin(socket.id, username, email, phone, message);

        // welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to WebSpiders ChatBox'));

        // broadcast when a user connects
        socket.broadcast.emit('message', formatMessage(botName, `${user.username} has joined the chat`));


        io.emit('message', formatMessage(botName, `${user.username} says..`));

        // save broadcast details
        let broadcastDetails = (user) => {
            return new Promise((resolve, reject) => {
                console.log('inside broadcast');
                io.emit('message', formatMessage(botName, `${user.message}..`));
                io.emit('message', formatMessage(botName, `Please contact user via email : ${user.email}
                    or phone : ${user.phone}..
                    `));
                resolve('Broadcasted details!!');
            });
        }

        // execution in parallel (mutli core) and concurrence (single core)
        // 1. Broadcast details of new member
        // 2. Save information
        // 3. Send mail to admin
        // 4. Send sms to admin
        Promise.all([broadcastDetails(user), file.writeFileAsync(user), mail.sendMail(user), sms.sendSMS(user)])
            .then(result => console.log(result))
            .catch(err => console.log(err));


        // send users and room info
        io.emit('roomUsers', {
            users: getRoomUsers()
        });
    });

    // listen for chatMessage
    socket.on('chatMessage', (msg) => {

        const user = getCurrentUser(socket.id);

        io.emit('message', formatMessage(user.username, msg));
    });

    // runs when disconnect
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if(user) {
        io.emit('message', formatMessage(botName, `${user.username} has left the chat`));
        }

         // send users and room info
        io.emit('roomUsers', {
            users: getRoomUsers()
        });

    });
});

const PRT = 3000 || process.env.PORT;

// listening to connections
server.listen(PRT, () => {
    console.log(`Server running on port ${PORT}`);
});
