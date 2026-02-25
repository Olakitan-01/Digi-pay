require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db.config');
const authRoutes = require('./routes/auth.route');
const User = require('./models/user.model');
const Account = require('./models/account.model');
const Transaction = require('./models/transaction.model');
const userRoutes = require('./routes/user.route');
const accountRoutes = require('./routes/account.route');
const adminRoutes = require('./routes/admin.route')

// Connect to MongoDB
connectDB();    

const app = express();

// Middleware to parse JSON bodies
app.use(express.json()); 

// Use auth routes
app.use('/api/auth', authRoutes); 
// Use user routes
app.use('/api/users', userRoutes);
// Use account routes
app.use('/api/account', accountRoutes);

//admin routes
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => {
    res.send('Hello World something huge is cominggggggggggggggggg. It is called Digi!');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

