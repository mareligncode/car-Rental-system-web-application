const http = require('http');
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const bookingRoutes = require('./routes/bookings');
const contactRoutes = require('./routes/contactRoutes');
const paymentRoutes = require('./routes/payment');
const notificationRoutes = require('./routes/notifications');
const employeeRoutes = require('./routes/employees'); 
const taskRoutes = require('./routes/tasks'); 


const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected via WebSocket:', socket.id);
    socket.on('authenticate', (token) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded && decoded.role === 'admin') {
                socket.join('admins');
                console.log(`Socket ${socket.id} authenticated as admin and joined 'admins' room.`);
            }
        } catch (error) {
            console.log(`Socket ${socket.id} failed authentication:`, error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
app.use(cors());
// const coroption={
//     origin:[
//         "http://localhost:300",
//         "http://localhost:300/api"
//     ],
// }
// app.use(cors(coroption))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    req.io = io;
    next();
});
connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/employees', employeeRoutes); // Use employee routes
app.use('/api/tasks', taskRoutes); // <-- ADD THIS LINE



const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.listen(PORT, () => console.log(`Server with WebSocket support running on port ${PORT}`));



























/*
1.notefication when booking performed
2.avaliblity of car
3.payment method 
4.password reset
5.discount
6.recipt
7.contract and make contract document
*/
