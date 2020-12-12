import { useMemo, useState } from 'preact/hooks';

import { ClientEntity } from '@amtypes/entity';

import { config } from '../../globals';
import { getAdapterNameFromEntity } from '../../adapters/adapters';

// Get original scripts embedded for this page
const originalParentBody = window.top.document.body.innerHTML;

function setupRiftDocument(
	entity: ClientEntity,
	currentRiftRef: HTMLIFrameElement,
	options: { isolated: boolean; entityUuid: string }
) {
	if (!currentRiftRef) return;
	let renderedDocument = config.frameHtml;

	if (options.isolated) {
		renderedDocument = renderedDocument.replace(
			'{AM_LOAD}',
			originalParentBody
		);
		renderedDocument = renderedDocument.replace(
			'{AM_ENTITY}',
			options.entityUuid
		);
		renderedDocument = renderedDocument.replace(
			'{AM_ENTITY_ADAPTER}',
			getAdapterNameFromEntity(entity)
		);
	}

	currentRiftRef.contentDocument.open('text/html');
	currentRiftRef.contentDocument.write(renderedDocument);
	currentRiftRef.contentDocument.close();
}

export function useRiftDocument(entity: ClientEntity, options) {
	const [currentRiftRef, updateRiftRef] = useState(null);

	useMemo(() => setupRiftDocument(entity, currentRiftRef, options), [
		options.entityUuid,
		currentRiftRef,
	]);

	return {
		updateRiftRef,
		currentRiftRef,
	};
}
