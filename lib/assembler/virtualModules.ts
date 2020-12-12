import { AMServerContext } from '@amtypes/server.d';

import path from 'path';
import chokidar from 'chokidar';

import VirtualModulesPlugin from 'webpack-virtual-modules';

const virtualManifestPath = path.resolve('.', '@manifest.js');
const virtualConfigPath = path.resolve('.', '@config.js');

// singleton reference
let pluginRef;

export const virtualModulePlugin = (
	context: AMServerContext
): VirtualModulesPlugin => {
	pluginRef = new VirtualModulesPlugin({
		// define manifest as loadable resource
		[virtualManifestPath]: context.initialManifest,
		[virtualConfigPath]: context.initialOptions.staticConfigAsString,
	});

	return pluginRef;
};

export const virtualModuleAliases = {
	'@manifest.js': virtualManifestPath,
	'@config.js': virtualConfigPath,
};

export function watchFilesAndWaitForRebuild(
	initialContext: AMServerContext
): void {
	let currentManifest = initialContext.initialManifest;
	let currentOptions = initialContext.initialOptions;
	let currentPaths = initialContext.initialDetectedPaths;

	const log = (msg) => process.stdout.write(msg);

	// watch config/manifest files
	chokidar
		.watch(
			[path.join(currentOptions.configDirectory, '*'), ...currentOptions.match],
			{ persistent: true, atomic: true }
		)
		.on('change', async () => {
			log(
				'[automanual] Detected internal changes - rebuilding configuration and manifests\n'
			);

			// Get initial values needed for the initial build step
			log('[automanual] Rebuilding configuration... ');
			const results = await initialContext.serverHelpers.loadOptions();
			log(' Done!\n');
			[currentOptions, currentPaths] = results;
			log('[automanual] Rebuilding manifests... ');
			currentManifest = await initialContext.serverHelpers.loadManifestAndEntities(
				currentOptions,
				currentPaths
			);
			log(' Done!\n');

			// write modules
			console.log('[automanual] Reconciling virtual modules');
			pluginRef.writeModule(virtualManifestPath, currentManifest);
			pluginRef.writeModule(
				virtualConfigPath,
				currentOptions.staticConfigAsString
			);
		});

	console.log('wait for build');
}
