/** @jsx h */
import { h } from 'preact';
import { BEM } from '../../../helpers';

import outerUrl from './am-logo-outer.svg';
import innerUrl from './am-logo-inner.svg';

export default function AmSpinner({ scale = 1.5 }) {
	const width = scale * 133;
	const height = scale * 171;

	const variant = 2;

	return (
		<div
			className={BEM('am-spinner', `variant-${variant}`)}
			style={{ width, height }}
		>
			<div
				className="am-spinner__inner"
				style={{ backgroundImage: `url('${innerUrl}')` }}
			/>
			<div
				className="am-spinner__outer"
				style={{ backgroundImage: `url('${outerUrl}')` }}
			/>
		</div>
	);
}
