/** @jsx h */
import { h } from 'preact';

import { IconGetterProps } from '@amtypes/client';

import {
	CodeBracesBox,
	CodeGreaterThan,
	MinusBox,
	TextBox,
} from '../Icon/Icon';

export const getIconTypeFromProps = ({
	item,
	isFolded,
}: IconGetterProps): string => {
	if (item.children && item.children.length) {
		return isFolded ? 'folded' : 'expanded';
	}

	if (item.targetEntityPath) {
		return item.targetEntityPath.includes('doc') ? 'code' : 'misc';
	}

	return 'misc';
};

export default function NavIcon({ type }: { type: string }) {
	const size = 16;

	switch (type) {
		case 'folded':
			return <CodeGreaterThan size={size} />;
		case 'expanded':
			return <MinusBox size={size} />;
		case 'code':
			return <CodeBracesBox size={size} />;
		default:
			break;
	}

	// misc
	return <TextBox size={size} />;
}
