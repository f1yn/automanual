/** @jsx h */
import { h, render } from 'preact';

import { entityManifest } from '../globals';
import Doc from '../components/Doc/Doc';

import { LoadedEntity } from '@amtypes/entity';
import { AMAdaptor } from '@amtypes/adaptor';

export default function main(
	entityUuid: string,
	loadedEntity: LoadedEntity,
	adapter: AMAdaptor
) {
	render(
		<Doc
			entity={entityManifest[entityUuid]}
			entityUuid={entityUuid}
			preloadedEntity={loadedEntity}
			preloadedAdapter={adapter}
			isolated
		/>,
		document.getElementById('automanual-root')
	);
}
