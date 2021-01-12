/** @jsx h */
import { h, render } from 'preact';
import { AMAdaptor } from '@amtypes/adaptor';

import { applyDecorators } from './shared';

export default {
	onMount(frameContainer, Component, decorators) {
		const FinalComponent = applyDecorators(<Component />, decorators);
		render(<FinalComponent />, frameContainer);
	},
	onUnmount(frameContainer, component) {
		console.log('unmount preact');
	},
} as AMAdaptor<preact.ComponentType>;
