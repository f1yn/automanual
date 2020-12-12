/** @jsx h */
import { h, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import AmSpinner from '../AmSpinner/AmSpinner';

const loadedEntitiesByUuid = new Set();
const loadingStateMessagesByUuid = new Map();

export default function LoadingProvider({ children, entityUuid, isolated }) {
	const [canShowLoading, setCanShowLoading] = useState(false);
	const forceRender = useState()[1];

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
			window.__am_updateEntityLoadingState = function (entityUuid, newState) {
				if (typeof entityUuid !== 'string') return;
				loadedEntitiesByUuid[newState ? 'add' : 'delete'](entityUuid);
				// Force a re-render once loading state updates for a given entity
				forceRender(Math.random());
			};
			window.__am_updateEntityLoadingStateMessage = function (
				entityUuid,
				message
			) {
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

export function getLoadingState(entityUuid) {
	return !loadedEntitiesByUuid.has(entityUuid);
}

export function setLoadingState(entityUuid, newState) {
	window.top.__am_updateEntityLoadingState(entityUuid, newState);
}

export function setLoadingMessage(entityUuid, message) {
	window.top.__am_updateEntityLoadingStateMessage(entityUuid, message);
}

function LoadingScreen({ entityUuid }) {
	if (!getLoadingState(entityUuid)) return null;

	const loadingMessage = loadingStateMessagesByUuid.get(entityUuid);

	return (
		<div className="am-loading">
			<div>
				<AmSpinner />
				{loadingMessage ? (
					<div className="am-loading__message">{loadingMessage}</div>
				) : null}
			</div>
		</div>
	);
}
