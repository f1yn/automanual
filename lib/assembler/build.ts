import { AMConfiguration } from '@amtypes/config';
import { AMServerContext } from '@amtypes/server';

import path from 'path';
import webpack from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import advancedInsertAtTop from './webpackInsertStyleHelper';
import { virtualModuleAliases } from './virtualModules';

import allShims from '../shims/shims';

/**
 * Ensures deps are loaded from as user directory
 * @type {Array}
 */
const sharedDeps = ['react', 'react-dom'];

const buildAliasPath = (moduleName: string): { [k: string]: string } => ({
	[moduleName]: path.resolve(process.cwd(), './node_modules', moduleName),
});

function generateWebpackConfig(
	options: AMConfiguration,
	context: AMServerContext
): any {
	// Define the bare minimum configuration that can be externally extended

	const swcLoader = {
		loader: 'swc-loader',
		options: {
			jsc: {
				parser: {
					syntax: 'typescript',
					tsx: true,
					dynamicImport: true,
					decorators: false,
					// apply user values
					...(options.swcConfig || {}),
				},
			},
		},
	};

	const mode = process.env.NODE_ENV || 'production';

	const baseConfig = {
		devServer: {
			...options.devServer,
		},
		mode,
		context: context.cwd,
		entry: {
			root: path.resolve(__dirname, '../../lib/client/root.tsx'),
		},
		output: {
			path: options.output,
			// default public path for loading chunks
			publicPath: '/',
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					amManifest: {
						test: /@manifest\.js/,
						name: 'manifest',
						chunks: 'initial',
						enforce: true,
					},
				},
			},
			minimize: mode !== 'development',
		},
		resolve: {
			extensions: ['.js', '.ts', '.tsx'],
			alias: {
				'@amtypes': path.resolve(__dirname, '../../lib/types'),
				'@theme-host.scss': context.hostThemeSource,
				'@theme-rift.scss': context.riftThemeSource,
				...allShims,
				...virtualModuleAliases,
				...Object.assign({}, ...sharedDeps.map(buildAliasPath)),
			},
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx|ts|tsx)$/,
					exclude: /node_modules/,
					use: [swcLoader],
				},
				{
					test: /\.mdx$/,
					exclude: /node_modules/,
					use: [swcLoader, '@mdx-js/loader'],
				},
				// based on storybook configuration (https://github.com/storybookjs/storybook/blob/next/lib/core/src/server/preview/base-webpack.config.js)
				{
					test: /\.css$|\.s[ac]ss$/,
					sideEffects: true,
					use: [
						{
							loader: require.resolve('style-loader'),
							options: {
								insert: advancedInsertAtTop,
							},
						},
						{
							loader: require.resolve('css-loader'),
							options: {
								importLoaders: 1,
							},
						},
						{
							loader: require.resolve('sass-loader'),
						},
					],
				},
				{
					test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
					loader: require.resolve('file-loader'),
					options: {
						name: 'static/media/[name].[hash:8].[ext]',
						esModule: false,
					},
				},
				{
					test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
					loader: require.resolve('url-loader'),
					options: {
						limit: 10000,
						name: 'static/media/[name].[hash:8].[ext]',
					},
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				title: options.title || 'Automanual!',
				template:
					options.customHtmlPath ||
					path.resolve(__dirname, '../../lib/client/host.html'),
				// needed for isolation support
				inject: 'body',
			}),
			context.virtualModulePlugin(context),
		],
	};

	return options.webpackConfig(baseConfig);
}

export const doStaticBuild = (
	options: AMConfiguration,
	context: AMServerContext
) =>
	new Promise((resolve, reject) => {
		// Define the compiler
		const compiler = webpack(generateWebpackConfig(options, context));

		// Run the compiler and resolve through the Promise instance
		compiler.run((error, stats) => {
			if (error) {
				reject(error);
				return;
			}

			// console.log(stats.compilation.missingDependencies);

			if (stats.compilation.errors && stats.compilation.errors.length) {
				reject(stats.compilation.errors[0]);
				return;
			}

			resolve(stats);
		});
	});

export async function startDevelopmentServer(
	options: AMConfiguration,
	context: AMServerContext
): Promise<void> {
	const { default: WebpackDevServer } = await import('webpack-dev-server');

	const webpackConfig = generateWebpackConfig(options, context);
	const compiler = webpack(webpackConfig);

	const server = new WebpackDevServer(compiler, webpackConfig.devServer);

	server.listen();

	// Define the compiler
}
