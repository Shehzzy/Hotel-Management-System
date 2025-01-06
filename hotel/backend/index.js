const express = require('express');
const cors = require('cors');
const bodyParser  = require('body-parser');
require('dotenv').config();
require('./utils/connection');
const app  = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());



app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})