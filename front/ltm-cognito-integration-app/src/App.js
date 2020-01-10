import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import Routes from './Routes';
import './App.css';
import { LinkContainer } from 'react-router-bootstrap';

function App(props) {
	return (
		<div className='App container'>
			<Navbar collapseOnSelect>
				<Navbar.Brand>
					<Link to='/'>LTM</Link>
				</Navbar.Brand>
				<Navbar.Collapse>
					<Nav>
						<LinkContainer to='/login'>
							<Nav.Item href='/login'>Login</Nav.Item>
						</LinkContainer>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
			<Routes />
		</div>
	);
}

export default App;
