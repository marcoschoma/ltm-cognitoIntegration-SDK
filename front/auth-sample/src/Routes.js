import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import CognitoUserManager from './CognitoUserManager';

let isAuthenticated = false;

// const configs = {
// 	authority:
// 		'http://auth.padrao-qa2.webpremios.digital/.well-known/openid-configuration',
// 	client_id: '4lunmtr2cn2plb2sspavoakuk5',
// 	redirect_uri: 'http://localhost:3000/auth/callback',
// 	response_type: 'token id_token',
// 	scope: 'openid profile email webpremios.campaigns/1',
// 	post_logout_redirect_uri: 'http://localhost:3000/'
// };
const configs = {
	authority: process.env.REACT_APP_COGNITO_DISCOVERY_ENDPOINT,
	client_id: process.env.REACT_APP_AUTH_CLIENT_ID,
	redirect_uri: process.env.REACT_APP_AUTH_CALLBACK,
	response_type: process.env.REACT_APP_AUTH_RESPONSE_TYPE,
	scope: process.env.REACT_APP_AUTH_SCOPES,
	post_logout_redirect_uri: 'http://localhost:3000'
};
const userManager = new CognitoUserManager(configs);

export default function Routes() {
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

function Home() {
	return <h2>Public information</h2>;
}

function RestrictedPage() {
	return (
		<div>
			<h2>Restricted section with secure information</h2>
			<header className='App-header'>
				{isAuthenticated && (
					<p>User is authenticated - secure information displayed</p>
				)}
				{!isAuthenticated && (
					<div>
						<p>User is not authenticated</p>
						<button className='App-link' onClick={signIn}>
							Please login
						</button>
					</div>
				)}
			</header>
		</div>
	);
}

function signIn() {
	userManager.signinRedirect();
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
