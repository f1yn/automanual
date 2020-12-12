import { AMAdaptor } from '@amtypes/adaptor';

const applyDecorators = (originalGetHtml, decorators) => () => {
	let finalGetHtml = originalGetHtml();

	if (!decorators || !decorators.length) return finalGetHtml;

	let index = decorators.length;
	while (index--) {
		finalGetHtml = decorators[index](finalGetHtml);
	}

	return finalGetHtml;
};

export default {
	onMount(frameContainer, originalGetHtml, decorators) {
		console.log('mount html');
		const getHTML = applyDecorators(originalGetHtml, decorators);
		frameContainer.innerHTML = getHTML();
	},
	onUnmount(frameContainer, component) {
		console.log('unmount html');
	},
} as AMAdaptor;
