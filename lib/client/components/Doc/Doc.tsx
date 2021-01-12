/** @jsx h */
import { Fragment, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { DocProps, DocConfiguration } from '@amtypes/client';
import { LoadedEntity } from '@amtypes/entity';
import { AMAdaptor } from '@amtypes/adaptor';

import useModifiers from '../../modifiers/modifiers';
import loadAdapterByName, {
	getAdapterNameFromEntity,
} from '../../adapters/adapters';
import DocEntity from '../DocEntity/DocEntity';

import { setLoadingMessage } from '../LoadingProvider/LoadingProvider';

export default function Doc({
	entity,
	entityUuid,
	selfRef,
	preloadedEntity,
	preloadedAdapter,
	isolated,
}: DocProps) {
	const [loadedEntity, setLoadedEntity] = useState<LoadedEntity>(
		preloadedEntity
	);
	const [loadedAdapter, setLoadedAdapter] = useState<AMAdaptor>(
		preloadedAdapter
	);
	const adapterName = getAdapterNameFromEntity(entity);

	useModifiers({
		frame: !isolated && selfRef.contentWindow,
		doc: !isolated && selfRef.contentDocument,
		entity,
		entityUuid,
		isolated,
	});

	// Load in entity
	useEffect(() => {
		if (loadedEntity) return;
		setLoadingMessage(entityUuid, 'loading entity');
		Promise.all([
			// load the entity and it's various components
			entity.load(),
			// load the correct adapter for this doc
			loadAdapterByName(adapterName),
		]).then(
			([loadedEntityMod, loadedAdapterMod]: [LoadedEntity, AMAdaptor]) => {
				if (loadedEntityMod) setLoadedEntity(loadedEntityMod);
				if (loadedAdapterMod) setLoadedAdapter(loadedAdapterMod);
			}
		);
	}, [loadedEntity, entity, adapterName]);

	// Reply on loading provider
	if (!loadedEntity) return null;

	const docConfiguration = {
		...(loadedEntity.default.config || {}),
		...(loadedEntity.default.options || {}),
	} as DocConfiguration;

	// Only use single result for a mdx page
	const isMdxPage = adapterName === 'mdx';

	// each item to be rendered for this doc page (inside of Rift)
	const renderList = [] as preact.JSX.Element[];

	(isMdxPage ? ['mdx'] : Object.keys(loadedEntity)).forEach(
		(docName: string) => {
			if (docName === 'default') return;

			if (!docConfiguration.noHeadings && !isMdxPage) {
				renderList.push(
					<h2
						className="am-doc-heading"
						id={docName}
						key={`heading-${docName}`}
					>
						{docName}
					</h2>
				);
			}

			const docComponent = isMdxPage
				? // get MDX component as page
				  loadedEntity.default.page
				: // get component by key
				  loadedEntity[docName];

			renderList.push(
				<DocEntity
					decorators={loadedEntity && loadedEntity.default.decorators}
					entityUuid={entityUuid}
					name={docName}
					key={`am-comp-${docName}`}
					component={docComponent}
					adapter={loadedAdapter}
				/>
			);
		}
	);

	return <Fragment>{renderList}</Fragment>;
}
