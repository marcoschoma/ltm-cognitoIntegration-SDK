import React from 'react';
import './Home.css';
import ListData from '../components/ListData';

export default function Home() {
	return (
		<div className='Home'>
			<div className='lander'>
				<h1>LTM Congnito Integration SDK</h1>
				<ListData />
			</div>
		</div>
	);
}
