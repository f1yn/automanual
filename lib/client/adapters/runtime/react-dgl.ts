// A very tiny React-docgen replacement for runtime analysis
// Relies on webpack doing heavy lifting and making prop-types the same between
// the loaded source and automanual. Uses object equivalence (by ref) comparaison

import PropTypes from 'prop-types';

const allKnownPropTypeNames = Object.keys(PropTypes);

function resolveTypeNameFromFunctionIdentity(propTypeFunction) {
	let index = allKnownPropTypeNames.length;
	let typeName;

	while (index--) {
		typeName = allKnownPropTypeNames[index];

		if (!PropTypes[typeName]) continue;

		if (propTypeFunction === PropTypes[typeName]) {
			return typeName;
		}
	}

	return null;
}

export default function generatePropSchema(componentPropTypes) {
	const output = {};

	Object.keys(componentPropTypes).forEach((key) => {
		output[key] = resolveTypeNameFromFunctionIdentity(componentPropTypes[key]);
	});

	console.log(output);

	return {};
}
