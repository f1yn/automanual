export default function advancedInsertAtTop(styleElement: HTMLStyleElement) {
	let resultElement = styleElement as HTMLStyleElement | HTMLMetaElement;

	if (window.top['__amInsertedStyleCount']) {
		// apply hack to prevent styles from polluting global namespace
		resultElement = document.createElement('meta');
		resultElement['__amStyleTempNode'] = styleElement;
		resultElement.dataset.amStyleTemp = 'true';
	}

	if (window.top['__amInsertedStyleCount'] !== 'number') {
		window.top['__amInsertedStyleCount'] = 0;
	}

	window.top['__amInsertedStyleCount'] += 1;

	window.top.document.head.appendChild(resultElement);
}
