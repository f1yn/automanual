/** @jsx h */
import { h, Fragment } from 'preact';
import { createPortal } from 'preact/compat';

import { RiftProps } from '@amtypes/client';

import { BEM } from '../../../helpers';

import { useRiftDocument } from './useRiftDocument';
import LoadingProvider from '../LoadingProvider/LoadingProvider';

import Doc from '../Doc/Doc';

/**
 * The Rift is an experimental same-origin portal adapter, which allows rendering front-end specific examples in a way
 * that's ambiguous to framework quirks. Essentially, this ust sets up a pocket dimension where demonstrate components
 * safely, without multi-entry hacks.
 *
 * Unlike a shared iframe approach, which can introduce several side effect between previews and renders, each Rift lives
 * independently, and any global styles, external code, and other side effects are configured manually (either inherited,
 * or statically defined). this ensures a quick cleanup and setup for each example.
 *
 * Each Rift is connected to a specific adapter, which is responsible for mounting a said example as an microfrontend.
 *
 */

export default function Rift(props: RiftProps) {
	const isolated = props.entity.essential.isolate;

	const riftData = useRiftDocument(props.entity, {
		isolated,
		entityUuid: props.entityUuid,
	});

	const frameRender = (
		<LoadingProvider entityUuid={props.entityUuid} isolated={isolated}>
			<iframe
				ref={riftData.updateRiftRef}
				className={BEM('am-rift', isolated && 'isolated')}
			/>
		</LoadingProvider>
	);

	if (isolated) {
		return frameRender;
	}

	return (
		<Fragment>
			{frameRender}
			{riftData.currentRiftRef
				? createPortal(
						<Doc selfRef={riftData.currentRiftRef} {...props} />,
						riftData.currentRiftRef.contentDocument.body
				  )
				: null}
		</Fragment>
	);
}
