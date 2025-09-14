const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://rathorpawan128:9ThdeeAZIVC2xRXt@clusterone.vhjas.mongodb.net/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));

app.get('/' , (req,res)=>{
   res.send('Backend is Running')
})

const PORT = process.env.PORT  || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
