import { AMAdaptor } from '@amtypes/adaptor';

import { applyDecorators } from './shared';

type HTMLComponent = () => string;

export default {
	onMount(frameContainer, originalGetHtml, decorators) {
		const getHTML = applyDecorators(originalGetHtml(), decorators);
		frameContainer.innerHTML = getHTML();
	},
	onUnmount(frameContainer, component) {
		console.log('unmount html');
	},
} as AMAdaptor<HTMLComponent>;
