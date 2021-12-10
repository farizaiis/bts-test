const express = require('express');
const cors = require('cors');
const app = express();
const Router = require('./routes/index');
const moment = require('moment');

app.use(cors());
app.use(express.json());

app.use('/api', Router);

app.get('/', (req, res) => {
    res.json({
        message: 'Server running',
        serverTime: moment(new Date()).local(),
    });
});

app.get('*', function (req, res) {
    res.status(404).send('Not found');
});

module.exports = app;
