/** @jsx h */
import { h, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import AmLogo from '../AmLogo/AmLogo';

const loadedEntitiesByUuid = new Set<string>();
const loadingStateMessagesByUuid = new Map<string, string | null>();

const globalSetKey = '__am_updateEntityLoadingState';
const globalSetMessageKey = '__am_updateEntityLoadingStateMessage';

export default function LoadingProvider({
	children,
	entityUuid,
	isolated,
}: {
	children: preact.ComponentChildren;
	entityUuid: string;
	isolated: boolean;
}) {
	const [canShowLoading, setCanShowLoading] = useState(false);
	const forceRender = useState(0)[1];

	// prevent showing loader if loading state is resolved within 64ms (typically from cache)
	useEffect(() => {
		// clear existing entity loading state
		loadedEntitiesByUuid.delete(entityUuid);

		if (isolated) {
			// setup bootstrap message for isolated render
			loadingStateMessagesByUuid.set(
				entityUuid,
				'setting up isolated environment'
			);
		} else {
			loadingStateMessagesByUuid.delete(entityUuid);
		}

		let timeout = setTimeout(() => setCanShowLoading(true), 64);

		return () => {
			if (timeout) clearTimeout(timeout);
		};
	}, [isolated, entityUuid]);

	useEffect(() => {
		if (window.top === window) {
			// bind hooks since we cant transfer context into an iframe
			window[globalSetKey] = function (entityUuid, newState) {
				if (typeof entityUuid !== 'string') return;
				loadedEntitiesByUuid[newState ? 'add' : 'delete'](entityUuid);
				// Force a re-render once loading state updates for a given entity
				forceRender(Math.random());
			};
			window[globalSetMessageKey] = function (entityUuid, message) {
				if (typeof entityUuid !== 'string') return;
				console.log('hook', entityUuid, message);
				loadingStateMessagesByUuid.set(entityUuid, message);
				// Force a re-render once loading state updates for a given entity
				forceRender(Math.random());
			};
		}
	}, [forceRender]);

	return (
		<Fragment>
			{children}
			{canShowLoading && <LoadingScreen entityUuid={entityUuid} />}
		</Fragment>
	);
}

export function getLoadingState(entityUuid: string) {
	return !loadedEntitiesByUuid.has(entityUuid);
}

export function setLoadingState(entityUuid: string, newState: boolean) {
	window.top[globalSetKey](entityUuid, newState);
}

export function setLoadingMessage(entityUuid: string, message: string) {
	window.top[globalSetMessageKey](entityUuid, message);
}

function LoadingScreen({ entityUuid }: { entityUuid: string }) {
	if (!getLoadingState(entityUuid)) return null;

	const loadingMessage = loadingStateMessagesByUuid.get(entityUuid);

	return (
		<div className="am-loading">
			<div>
				<AmLogo baseClass="am-spinner" scale={1.5} />
				{loadingMessage ? (
					<div className="am-loading__message">{loadingMessage}</div>
				) : null}
			</div>
		</div>
	);
}
