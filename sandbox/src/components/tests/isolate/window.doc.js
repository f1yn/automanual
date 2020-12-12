import React, { useEffect } from 'react';

export default {
	name: 'Tests | Isolation Mode',
	adapter: 'react',
	isolate: true,
	config: {},
}

export const Default = () => {
	useEffect(() => {
		const style = document.createElement('style');
		style.innerHTML = '* { background: yellow !important; }';
		window.document.head.appendChild(style);
	}, []);

	return <h1>Only the frame should be yellow</h1>
}