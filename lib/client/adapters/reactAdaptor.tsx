import { AMAdaptor } from '@amtypes/adaptor';

// @ts-ignore
import React from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';

import { applyDecorators } from './shared';

export default {
	resolvePropDataFromEntity(loadedEntity) {
		console.log(
			loadedEntity.default.component && loadedEntity.default.component.propTypes
		);
		return Promise.resolve({ key: true });
	},
	onMount(frameContainer, Component, decorators) {
		// Initially render the doc component being mounted - attempt to extract metedata
		const FinalComponent = applyDecorators(<Component />, decorators);
		ReactDOM.render(<FinalComponent />, frameContainer);
	},
	onUnmount(frameContainer, component) {
		console.log('unmount react');
	},
} as AMAdaptor<React.ComponentType>;
