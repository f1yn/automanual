import { AMAdaptor } from '../../types/adaptor';

import React from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';

/**
 * When a specific story/config is pointed to show components in React, this file is used to show the React
 * component in it's own micro-front-end. This is rendered underneath a same-origin iframe.
 */

const applyDecorators = (Component, decorators) => () => {
	let finalRender = <Component />;

	if (!decorators || !decorators.length) return finalRender;

	let index = decorators.length;
	while (index--) {
		finalRender = decorators[index](finalRender);
	}

	return finalRender;
};

export default {
	onMount(frameContainer, Component, decorators) {
		console.log('mount mdx');
		const FinalComponent = applyDecorators(Component, decorators);
		ReactDOM.render(<FinalComponent />, frameContainer);
	},
	onUnmount(frameContainer, component) {
		console.log('unmount react');
	},
} as AMAdaptor;
