/** @jsx h */

import { h } from 'preact';
import { Link } from 'preact-router';

import { BEM } from '../../../helpers';
import { config } from '../../globals';

import { NavItemContentProps, NavItemProps } from '@amtypes/client';

import NavIcon, { getIconTypeFromProps } from '../NavIcon/NavIcon';

function NavItemContent({
	item,
	level,
	isFolded,
	isSearchHighlighted,
}: NavItemContentProps) {
	const isHeading =
		level === 0 && config.uiOptions && config.uiOptions.firstLayerAsHeading;

	const type = getIconTypeFromProps({
		item,
		isFolded,
	});

	const content = (
		<span
			className={BEM(
				`am-header__nav-${isHeading ? 'heading' : 'content'}`,
				type,
				isSearchHighlighted && 'search-highlighted'
			)}
		>
			{!isHeading ? <NavIcon type={type} /> : null}
			<span>{item.name}</span>
		</span>
	);

	return item.targetEntityPath ? (
		<Link
			className={BEM('am-header__nav-link', `level-${level}`)}
			href={item.targetEntityPath}
		>
			{content}
		</Link>
	) : (
		<span className={BEM('am-header__nav-linkless', `level-${level}`)}>
			{content}
		</span>
	);
}

export default function NavItem({
	item,
	level,
	isFolded,
	onFoldAction,
	literalMatches,
}: NavItemProps) {
	const isFoldable = item.children && item.children.length;
	const isSearchHighlighted = literalMatches.includes(item);

	const content = (
		<NavItemContent
			item={item}
			level={level}
			isFolded={isFolded}
			isSearchHighlighted={isSearchHighlighted}
		/>
	);

	return (
		<li
			className={BEM(
				'am-header__nav-item',
				`level-${level}`,
				item.targetEntityPath && 'has-link',
				isFoldable && 'foldable'
			)}
		>
			{isFoldable ? (
				<button
					className={BEM('am-header__nav-button', `level-${level}`)}
					onClick={() => onFoldAction(item)}
				>
					{content}
				</button>
			) : (
				content
			)}
		</li>
	);
}
