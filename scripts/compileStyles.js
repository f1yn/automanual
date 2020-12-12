import path from 'path';
import util from 'util';

import sass from 'sass';
import write from 'write';

const renderSass = util.promisify(sass.render);

const sourceDirectory = path.resolve('./lib/client/themes');
const destinationDirectory = path.resolve('./dist/themes');

await Promise.all([
	'default.scss'
].map(async (sassFileName) => {
	const sourcePath = path.join(sourceDirectory, sassFileName);
	const destinationPath = path.join(destinationDirectory, `${path.basename(sassFileName, '.scss')}.css`);

	const result = await renderSass({ file: sourcePath });

	await write(destinationPath, result.css, { overwrite: true });
}));
