const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const user = require('./router/userRoutes');
const anagram = require('./router/anagramRoutes');

dotenv.config({ path: './config.env' });
const app = express();

const port = process.env.PORT || 8000;
mongoose.connect('mongodb://localhost:27017/Interview', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database Connected Successfully');
});

app.use(cors());


//Body,parser, reading data from body into req.body
app.use(express.json());

app.use('/api/v1/users', user);
app.use('/api/v1/anagram', anagram)

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})