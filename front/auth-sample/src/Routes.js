import React, { Component, useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import CognitoUserManager from './CognitoUserManager';

const configs = {
	authority: process.env.REACT_APP_COGNITO_DISCOVERY_ENDPOINT,
	client_id: process.env.REACT_APP_AUTH_CLIENT_ID,
	redirect_uri: process.env.REACT_APP_AUTH_CALLBACK,
	response_type: process.env.REACT_APP_AUTH_RESPONSE_TYPE,
	scope: process.env.REACT_APP_AUTH_SCOPES,
	post_logout_redirect_uri: 'http://localhost:3000',
	// silent_redirect_uri: 'http://localhost:3000/silent-callback',
	silent_redirect_uri: 'http://localhost:3000/silent_renew.html',
	automaticSilentRenew: true
};
const userManager = new CognitoUserManager(configs);
console.log(userManager);
userManager.events.addUserLoaded(data => {
	console.log('user loaded!', data);
});

class Routes extends React.Component {
	render() {
		return (
			<Router>
				<div>
					<nav>
						<ul>
							<li>
								<Link to='/'>Public resource</Link>
							</li>
							<li>
								<Link to='/restricted-page'>Restricted resource</Link>
							</li>
						</ul>
					</nav>

					<Switch>
						<Route path='/auth/callback'>
							<Callback />
						</Route>
						<Route path='/auth/silent-callback'>
							<SilentCallback />
						</Route>
						<Route path='/restricted-page'>
							<RestrictedPage />
						</Route>
						<Route path='/'>
							<Home />
						</Route>
					</Switch>
				</div>
			</Router>
		);
	}
}

function Home() {
	return <h2>Public information</h2>;
}

class RestrictedPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isAuthenticated: false
		};
	}

	componentDidMount() {
		if (!this.state.isAuthenticated) {
			userManager.signinSilent().then(user => {
				console.log('silenthill 1');
				console.log(user);
				this.setState({
					isAuthenticated: true,
					login: user.login
				});

				userManager.getUser().then(user => {
					console.log('silenthill 2');
					console.log(user);
				});
			});
		}
	}

	render() {
		return (
			<div>
				<h2>Restricted section with secure information</h2>
				<header className='App-header'>
					{this.state.isAuthenticated && (
						<p>User is authenticated - secure information displayed</p>
					)}
					{!this.state.isAuthenticated && (
						<div>
							<p>User is not authenticated</p>
							<button className='App-link' onClick={this.login}>
								Please login
							</button>
						</div>
					)}
				</header>
			</div>
		);
	}
	login() {
		userManager.signinRedirect();
	}
}

function SilentCallback() {
	console.log('callback silencioso');
	let user = userManager.signinSilentCallback();
	console.log(user);
	return;
}

function Callback() {
	console.log('callback!');

	const [user, setUser] = useState({ isLoading: true });

	useEffect(() => {
		async function fetchData() {
			let user = await userManager.signinRedirectCallback();
			setUser(user);
		}
		fetchData();
		return () => null;
	}, user);

	return (
		<h2>Usuário logado: {user.isLoading ? 'Loading' : user.profile.name}</h2>
	);
}

export default Routes;
