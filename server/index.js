const express = require('express');
const bodyParser = require('body-parser');
const sendSMS = require('./twilio');

const app = express();

const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use (bodyParser.json());

app.get('/sms', (req, res) => {
    const { state, number } = req.query;
    console.log(state, number);
    sendSMS(state, number);
    console.log('request received');
})

app.listen(port, () => { console.log('server running') });
