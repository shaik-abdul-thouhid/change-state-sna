require('dotenv').config();
const accountSid = 'ACc75b12054094ca099999fc0c8c65717f';
const authToken = 'a440f17385b13e95652281952408373e';
const client = require('twilio')(accountSid, authToken);

const sendSMS = (State, number) => {

    client.messages.create({
        body: `State 0`,
        from: '+15632046187',
        to: '+919108072939'
    }).then(message => console.log(message.sid));
    console.log('message sent');
};

module.exports = sendSMS;