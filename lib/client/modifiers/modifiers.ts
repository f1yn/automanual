/** @jsx h */
import { RiftInstance } from '@amtypes/modifier';
import { useMemo, useEffect } from 'preact/hooks';

import buildDynamicHeadModifier from './dynamicHeadModifier/dynamicHeadModifier';
import syncHashToRift from './syncHashToRift/syncHashToRift';

const dynamicHeadModifier = buildDynamicHeadModifier();

function useModifiers(options: RiftInstance) {
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
