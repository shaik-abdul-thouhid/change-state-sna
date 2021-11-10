import axios from 'axios';
import twilio from 'twilio';
import qs from 'qs';
const client = twilio(process.env.REACT_APP_SID, process.env.REACT_APP_TOKEN)

async function createSMS(State, number) {
    client.messages.create({
        body: `State ${ State }`,
        from: process.env.REACT_APP_NUMBER,
        to: `${ number }`
    })
    .then(message => console.log(message.sid));

    await(axios.post('https://api.twilio.com/2010-04-01/Accounts/' + process.env.REACT_APP_SID + '/Messages.json'), qs.stringify({
        Body: `State ${ State }`,
        From: process.env.REACT_APP_NUMBER,
        To: `${ number }`
    }), {
        auth: {
            username: process.env.REACT_APP_SID,
            password: process.env.REACT_APP_TOKEN
        }
    })
}

export default createSMS;