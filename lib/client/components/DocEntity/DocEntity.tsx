/** @jsx h */
import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

import { setLoadingState } from '../LoadingProvider/LoadingProvider';
import { DocEntityProps } from '../../../types/client';

export default function DocEntity({
	entityUuid,
	decorators,
	component,
	name,
	adapter,
}: DocEntityProps) {
	const containerRef = useRef() as React.RefObject<HTMLDivElement>;

	// handle adapter here
	useEffect(() => {
		if (!containerRef) return;
		adapter.onMount(containerRef.current, component, decorators);
		// Flag loading as done for this entity
		setLoadingState(entityUuid, true);
		return () => adapter.onUnmount(containerRef.current, component);
	}, [adapter, containerRef]);

	if (!adapter) return null;

	return <div id={name} className="am-doc" ref={containerRef} />;
}
