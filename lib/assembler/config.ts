import { AMConfiguration } from '@amtypes/config.d';
import fs from 'fs';
import path from 'path';

import serialize from 'serialize-javascript';

let detectedIndexFile = false;

export async function loadConfiguration(cwd: string): Promise<AMConfiguration> {
	// TODO: allow custom config directory
	const configDirectory = path.join(cwd, './.automanual');
	const configFilePath = path.join(configDirectory, './config.js');
	const customHostHtmlPath = path.join(configDirectory, './host.html');
	const customFrameHtmlPath = path.join(configDirectory, './frame.html');

	// Define default configuration. User config overrides
	const configuration: Partial<AMConfiguration> = {
		// locations of specific files
		configDirectory,
		configFilePath,
		// Boolean fag to check if we should be using the dev server compiler
		enableDevServer: false,
		// default dev server options (when used)
		devServer: {
			// default options here
			historyApiFallback: {
				index: 'index.html',
			},
			// hot: true,
			open: true,
		},
		// define globs for matching files
		match: ['./src/**/*.doc.js'],
		// define pathname key-generator. Represents file path in url
		pathKey: (entity) =>
			`/${entity.type}/${entity.name.replace(
				/[^a-zA-Z0-9]+/g,
				'/'
			)}`.toLowerCase(),
		// define module source type (swc)
		sourceType: 'module',
		// output directory
		output: path.resolve(cwd, './docs'),
		// optional extending of the webpack configuration
		webpackConfig: (baseConfig) => baseConfig,
		// The default (fallback) adapter to use for documentation
		defaultAdapter: 'react',
	};

	// This can't update on config changes so use a mutable flag
	if (!detectedIndexFile) {
		if (fs.existsSync(customHostHtmlPath)) {
			configuration.customHtmlPath = customHostHtmlPath;
		}
		detectedIndexFile = true;
	}

	// Determine where to load the iframe contents
	const frameHtmlPath = fs.existsSync(customFrameHtmlPath)
		? customFrameHtmlPath
		: path.join(__dirname, '../client/frame.html');

	// Loaded frame html
	configuration.frameHtml = fs.readFileSync(frameHtmlPath, 'utf-8');

	// If we are in CLI mode we need to check the command for valid arguments
	if (global['__automanual_isCLI']) {
		applyCommandLineArgumentsToConfiguration(configuration);
	}

	// Use esm dynamic import to retrieve required user configuration
	const requireConfigPath = require.resolve(configFilePath);
	if (require.cache[requireConfigPath]) {
		// remove module from cache
		delete require.cache[requireConfigPath];
	}

	const userConfigurationImport = require(configFilePath);

	if (!Object.keys(userConfigurationImport.default).length) {
		throw new Error(
			'A default export is missing from the automanual configuration. Please provide one'
		);
	}

	// TODO: selective deep assign here
	Object.assign(configuration, userConfigurationImport.default);

	// TODO: validate configuration before using!

	return {
		...configuration,
		// generate string module version of applicable user config values
		staticConfigAsString: convertConfigToModuleString(configuration),
	} as AMConfiguration;
}

function applyCommandLineArgumentsToConfiguration(
	configurationRef: Partial<AMConfiguration>
): void {
	const args = Array.from(process.argv).splice(2);

	const enableDevServer = args.indexOf('dev') !== -1;

	if (enableDevServer) {
		configurationRef.enableDevServer = true;

		if (!process.env.NODE_ENV) {
			process.env.NODE_ENV = 'development';
		}
	}
}

function convertConfigToModuleString(
	sourceConfiguration: Partial<AMConfiguration>
): string {
	const configToConvert = {};

	['title', 'frameHtml', 'buildOptions', 'uiOptions', 'defaultAdapter'].forEach(
		(key) => {
			configToConvert[key] = sourceConfiguration[key];
		}
	);

	return `module.exports = ${serialize(configToConvert)}`;
}

const getBuiltInThemePathByName = (name: string) => ({
	host: `../client/themes/${name}.host.scss`,
	rift: `../client/themes/${name}.rift.scss`,
});

export async function resolveThemeSourcesFromConfig(
	cwd: string,
	config: AMConfiguration
): Promise<{ rift: string; host: string }> {
	// Use a fallback theme path
	let resultThemeSources = getBuiltInThemePathByName('default');

	// Detect known theme
	if (config.themeOptions) {
		// If specified, change the base AM theme
		if ([null].includes(config.themeOptions.name)) {
			resultThemeSources = getBuiltInThemePathByName(config.themeOptions.name);
		}

		if (config.themeOptions.hostThemePath) {
			resultThemeSources.host = path.join(
				cwd,
				config.themeOptions.hostThemePath
			);
		}

		if (config.themeOptions.riftThemePath) {
			resultThemeSources.rift = path.join(
				cwd,
				config.themeOptions.riftThemePath
			);
		}
	}

	return resultThemeSources;
}
