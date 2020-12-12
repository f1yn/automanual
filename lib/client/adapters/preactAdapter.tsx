/** @jsx h */
import { h, render } from 'preact';

import { AMAdaptor } from '@amtypes/adaptor';

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
		console.log('mount preact');
		const FinalComponent = applyDecorators(Component, decorators);
		render(<FinalComponent />, frameContainer);
	},
	onUnmount(frameContainer, component) {
		console.log('unmount preact');
	},
} as AMAdaptor;
