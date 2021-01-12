import { AMConfiguration } from '@amtypes/config.d';
import {
	AMServerContext,
	loadManifestResult,
	loadOptionsResult,
} from '@amtypes/server.d';

import globby from 'globby';

import { loadConfiguration, resolveThemeSourcesFromConfig } from './config';

import {
	generateRoutingEntitiesFromPaths,
	generateManifestAsString,
} from './manifest';

import {
	virtualModulePlugin,
	watchFilesAndWaitForRebuild,
} from './virtualModules';

const cwd = process.cwd();

// generate configuration
async function loadOptions(): Promise<loadOptionsResult> {
	const options = await loadConfiguration(cwd);
	// detect matching files based on user-provided globs
	const detectedPaths = await globby(options.match, { cwd });
	return [options, detectedPaths];
}

// generate manifest and entity mappings
async function loadManifestAndEntities(
	options: AMConfiguration,
	detectedPaths: Array<string>
): Promise<loadManifestResult> {
	// Generate entity objects used for injection and preparing the app build
	const routingEntities = await generateRoutingEntitiesFromPaths(
		cwd,
		detectedPaths,
		options
	);
	// Generate file needed for routing primary content via lazy loading
	return generateManifestAsString(routingEntities);
}

// Get initial values needed for the initial build step
const [initialOptions, initialDetectedPaths] = await loadOptions();
// Resolve theme
const resolvedThemeSources = await resolveThemeSourcesFromConfig(
	cwd,
	initialOptions
);
// Build the initial mapping of detected doc pages and the initial manifest
const initialManifest = await loadManifestAndEntities(
	initialOptions,
	initialDetectedPaths
);

// Build context object containing essential cross-step data.
// This object (ref) is recycled during webpack dev server updates
const context: AMServerContext = {
	cwd,
	initialOptions,
	initialManifest,
	initialDetectedPaths,
	hostThemeSource: resolvedThemeSources.host,
	riftThemeSource: resolvedThemeSources.rift,
	// ref to virtual module plugin
	virtualModulePlugin,
	// helper functions needed to rebuild specific parts for a live build
	serverHelpers: {
		loadOptions,
		loadManifestAndEntities,
	},
};

// Build (only import once we get here)
const builder = await import('./build');

if (initialOptions.enableDevServer) {
	// Use live server implementation
	await builder.startDevelopmentServer(initialOptions, context);

	// For a dev server build, watch to rebuild config file and/or manifest
	watchFilesAndWaitForRebuild(context);
} else {
	// Use static build configuration
	const stats = await builder.doStaticBuild(initialOptions, context);
	// @ts-ignore (weird webpack TS error)
	console.log(stats.toString({ colors: true }));
}
