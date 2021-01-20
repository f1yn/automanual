/** @jsx h */
import { h, render } from 'preact';
import { AMAdaptor } from '@amtypes/adaptor';

import { applyDecorators } from './shared';

export default {
	resolvePropDataFromEntity() {
		return Promise.resolve({ key: true });
	},
	onMount(frameContainer, Component, decorators) {
		// Initially render the doc component being mounted - attempt to extract metedata
		const FinalComponent = applyDecorators(<Component />, decorators);
		render(<FinalComponent />, frameContainer);
	},
	onUnmount(frameContainer, component) {
		console.log('unmount preact');
	},
} as AMAdaptor<preact.ComponentType>;
