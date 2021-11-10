import React, { useState, useEffect } from 'react';
import './App.css';
import {
	getFirestore,
	collection,
	getDocs,
	updateDoc,
	doc
} from 'firebase/firestore';
import app from './firebaseConfig';
import request from 'request';

const db = getFirestore(app);
let receivedObject, receivedTimeString, receivedTime, receivedState, ID;
const Time = new Date();
const currentTime = Time.getHours().toString() + ':' + Time.getMinutes().toString();
let first = 0;


const App = () => {

	const [ connectionCircle, setConnectionCircle ] = useState('#ff0000');
	const [ State, setState ] = useState('State 1');
	const [ Status, setStatus ] = useState('');
	const [ stateClassName, setStateClassName ] = useState('state1');
	const stateVariable = collection(db, 'state-time');
	const [ phoneNumber, setPhoneNumber ] =useState('');
	const [ input, setInput ] = useState(false);

	useEffect(() => {
		const getState = async () => {
			const data = await getDocs(stateVariable);
			console.log(data);
			receivedObject = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
			console.log('object', receivedObject);
			if (receivedObject.length !== 0) {
				receivedTimeString = receivedObject[0].time;
				receivedTime = receivedTimeString.split(':');
				receivedState = receivedObject[0].state;
				ID = receivedObject[0].id;
				console.log('state', receivedState, 'hours', receivedTime[0], 'minutes', receivedTime[1]);
				if (first === 0) {
					if (receivedState === 1) {
						setState('State 1');
						setStateClassName('state1');
						first++;
					} else if (receivedState === 0) {
						setState('State 0');
						setStateClassName('');
						first++;
					}

					if (receivedTime[0] === '11' && parseInt(receivedTime[1]) > 45 && parseInt(receivedTime[1]) < 55) {
						setConnectionCircle('#00ff00');
						setStatus('Device Online');
					} else {
						setConnectionCircle('#ff0000');
						setStatus('Device Offline');
					}
				}
			} else {
				alert('Unable to connect');
				setState('State 0');
				setStateClassName('');
				setConnectionCircle('#ff0000');
				setStatus('Device Offline');
				first++;
			}
		};
		getState();
	});

	console.log(currentTime);

	const changeState = async () => {
		// const num = prompt('Enter your phone number');
		if (State === 'State 0') {
			setState('State 1');
			setStateClassName('state1');
			await updateDoc(doc(db, 'state-time', ID), { state: 1 });
			request({ url: `http://localhost:5000/sms?state=${ 1 }&number=${ phoneNumber }`});
		} else {
			setState('State 0');
			setStateClassName('');
			await updateDoc(doc(db, 'state-time', ID), { state: 0 });
			request({ url: `http://localhost:5000/sms?state=${ 0 }&number=${ phoneNumber }`});
		}
	}

	return (
		<>
			{
				(!input) ?
				<>
					<h1>Enter phone number with country code: </h1>
					<input type='text' placeholder='ex: +918349898793' onChange={ (e) => setPhoneNumber(e.target.value) }/>
					<button onClick={ () => {
						if (phoneNumber === '') window.location.reload(false);
						else setInput(true)
					} }>Submit</button>
				</>
				:
				<>
					<div id="status">
						<svg height="30" width="30">
							<circle cx="15" cy="15" r="15" strokeWidth="2" fill={ connectionCircle } className='online' />
						</svg>
						<h4 id='connection-status'>{ Status }</h4>
					</div>
					<div onClick={ changeState } className={ `state ${ stateClassName }` }>
						<h1 id='state-text'>{ State }</h1>
					</div>
				</>
			}
		</>
	);
}

export default App;
