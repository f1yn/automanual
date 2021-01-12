import { AMAdaptor } from '@amtypes/adaptor';

// @ts-ignore
import React from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';

import { applyDecorators } from './shared';

export default {
	onMount(frameContainer, Component, decorators) {
		const FinalComponent = applyDecorators(<Component />, decorators);
		ReactDOM.render(<FinalComponent />, frameContainer);
	},
	onUnmount(frameContainer, component) {
		console.log('unmount react');
	},
} as AMAdaptor<React.ComponentType>;
