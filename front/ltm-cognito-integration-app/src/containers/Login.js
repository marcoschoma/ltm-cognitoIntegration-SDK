import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './login.css';

export default function Login(props) {
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');

	function validateForm() {
		return login.length > 0 && password.length > 0;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		try {
			//await Auth.signIn(login, password);
			alert('Logged in');
		} catch (e) {
			alert(e.message);
		}
	}

	return (
		<div className='Login'>
			<form onSubmit={handleSubmit}>
				<Form.Group controlId='login' bsSize='large'>
					<Form.Label>Login</Form.Label>
					<Form.Control
						autoFocus
						type='text'
						value={login}
						onChange={e => setLogin(e.target.value)}
					/>
				</Form.Group>
				<Form.Group controlId='password' bsSize='large'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						value={password}
						onChange={e => setPassword(e.target.value)}
						type='password'
					/>
				</Form.Group>
				<Button block bsSize='large' disabled={!validateForm()} type='submit'>
					Login
				</Button>
			</form>
		</div>
	);
}
