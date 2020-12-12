/** @jsx h */
import { useMemo, useEffect } from 'preact/hooks';

import buildDynamicHeadModifier from './dynamicHeadModifier/dynamicHeadModifier';
import syncHashToRift from './syncHashToRift/syncHashToRift';

const dynamicHeadModifier = buildDynamicHeadModifier();

function useModifiers(options) {
	const availableModifiers = [dynamicHeadModifier, syncHashToRift];

	// Instead of setting up in the hook, allow modifiers to pass a object reference to each
	// Rift using a given modifier. Not all modifiers need to return an interface.
	const modifierInterfaces = useMemo(() => {
		return Object.assign(
			{},
			...availableModifiers.map((modifier) => {
				// handle mount callback
				const io = modifier.onMount(options);
				if (!io) return;
				return { [modifier.id]: io };
			})
		);
	}, [options.entityUuid]);

	useEffect(() => {
		if (!options.frame) return;

		// setup style root for adding and removing styles
		if (!options.frame.amStyleRoot) {
			const styleElem = document.createElement('style');
			styleElem.id = 'amStyleRoot';
			options.frame.document.head.appendChild(styleElem);
		}

		// Handle unmount callback
		return () =>
			availableModifiers.forEach((modifier) => modifier.onUnmount(options));
	}, [options.frame, options.entityUuid]);

	// Handle onrender callback
	availableModifiers.forEach((modifier) => {
		if (modifier.onRender) modifier.onRender();
	});

	return modifierInterfaces;
}

export default useModifiers;
