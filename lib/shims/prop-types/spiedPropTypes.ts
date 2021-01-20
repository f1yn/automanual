// @ts-ignore
import OriginalPropTypes from 'original-prop-types';

import spyOn from '@reaktivo/spy-on-prop-types';

// Get list of chainable keys
const methodKeys = Object.keys(OriginalPropTypes).filter(
	(key) => !['checkPropTypes', 'PropTypes', 'resetWarningCache'].includes(key)
);

const ObjectToSpy = {};
methodKeys.forEach((key) => (ObjectToSpy[key] = OriginalPropTypes[key]));

export default Object.assign(OriginalPropTypes, spyOn(ObjectToSpy));
