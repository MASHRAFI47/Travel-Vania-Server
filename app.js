const express = require('express');
const app = express();

//cors
const cors = require('cors');
app.use(cors())

//form urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

module.exports = app;