import { AMConfiguration } from '@amtypes/config';

export type loadOptionsResult = [AMConfiguration, Array<string>];

export type loadManifestResult = string;

export interface AMServerContext {
	cwd: string;
	initialOptions: AMConfiguration;
	initialManifest: string;
	initialDetectedPaths: Array<string>;
	virtualModulePlugin: (ctx: AMServerContext) => any;
	serverHelpers: {
		loadOptions: () => Promise<loadOptionsResult>;
		loadManifestAndEntities: (
			options: AMConfiguration,
			detectedPaths: Array<string>
		) => Promise<loadManifestResult>;
	};
}
