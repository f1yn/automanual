export interface AMConfiguration {
	/**
	 * The full path of the directory
	 */
	readonly configDirectory: string;
	readonly configFilePath: string;
	readonly output: string;
	enableDevServer: boolean;
	readonly devServer: { [k: string]: any };
	match: Array<string>;
	pathKey: (string) => string;
	sourceType: string;
	webpackConfig: (any) => any;
	defaultAdapter: string;
	customHtmlPath?: string;
	frameHtml: string;
	staticConfigAsString: string;

	title?: string;
	swcConfig: { [k: string]: any };

	uiOptions?: { [k: string]: any };
	buildOptions?: { [k: string]: any };

	themeOptions?: {
		name?: string;
		customPath?: string;
	};

	sectionDivider?: RegExp | string;
}

export type AMClientConfig = Pick<
	AMConfiguration,
	'title' | 'frameHtml' | 'buildOptions' | 'uiOptions' | 'defaultAdapter'
>;
