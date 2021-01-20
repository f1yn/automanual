import path from 'path';

const clientPath = (subPath) =>
	path.join(__dirname.replace('dist/shims', 'lib/shims'), subPath);

export default {
	'prop-types': clientPath('./prop-types/spiedPropTypes.ts'),
	'original-prop-types': require.resolve('prop-types'),
};

console.log(clientPath('./prop-types/fakePropTypes.ts'));
