/** @jsx h */
import { h } from 'preact';
import { BEM } from '../../../helpers';

import { AmLogoProps } from '@amtypes/client';

// @ts-ignore
import outerUrl from './am-logo-outer.svg';
// @ts-ignore
import innerUrl from './am-logo-inner.svg';

export default function AmLogo({
	scale = 1,
	baseClass = 'am-logo',
}: AmLogoProps) {
	const width = scale * 133;
	const height = scale * 171;

	const variant = 2;

	return (
		<div
			className={BEM(baseClass, `variant-${variant}`)}
			style={{ width, height }}
		>
			<div
				className={`${baseClass}__inner`}
				style={{ backgroundImage: `url('${innerUrl}')` }}
			/>
			<div
				className={`${baseClass}__outer`}
				style={{ backgroundImage: `url('${outerUrl}')` }}
			/>
		</div>
	);
}
