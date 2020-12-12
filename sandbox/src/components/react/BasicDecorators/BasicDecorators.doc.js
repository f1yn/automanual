import React from 'react';

import TextValues from './TextValues';

function customDecoratorRed(DocEntity, _ctx) {
	return (
		<div style={{ color: 'red' }}>
			{DocEntity}
		</div>
	);
}

function customDecoratorGreen(DocEntity, _ctx) {
	return (
		<div style={{ color: 'green' }}>
			{DocEntity}
		</div>
	);
}

function customDecoratorBlue(DocEntity, _ctx) {
	return (
		<div style={{ color: 'blue' }}>
			{DocEntity}
		</div>
	);
}

export default {
	name: 'React | Decorators | Basic',
	adapter: 'react',
	decorators: [
		customDecoratorRed,
		customDecoratorGreen,
		customDecoratorBlue,
	],
};

export const SurroundWithBlue = () => (
	<TextValues text="This should be blue" />
);