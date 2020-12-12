const Template = require('webpack/lib/Template');

export default class WebpackInvalidatorPlugin {
	constructor(options) {
		this.options = options;
	}

	apply(compiler) {
		compiler.hooks.compilation.tap('VendorImport', (compilation) => {
			compilation.mainTemplate.hooks.requireExtensions.tap(
				'WebpackInvalidatorPlugin',
				(source) => {
					const buf = [source];
					buf.push('');
					buf.push("console.log('automanual installedChunks ref helper');");
					buf.push(
						compilation.mainTemplate.requireFn +
							'.__am_installedChunks = function() { return installedChunks; };'
					);
					return Template.asString(buf);
				}
			);
		});
	}
}
