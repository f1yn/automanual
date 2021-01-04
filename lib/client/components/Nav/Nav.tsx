/** @jsx h */
import { h } from 'preact';
import { useState, useMemo } from 'preact/hooks';

import { buildNavigationTree } from './navTree';

import { MenuAnyNode, MenuChildNode } from '@amtypes/menu';
import { NavSearchValue } from '@amtypes/client';

import NavItem from '../NavItem/NavItem';
import NavSearch from '../NavSearch/NavSearch';
import AmLogo from '../AmLogo/AmLogo';

import { config } from '../../globals';

export default function Nav() {
	// preserves object references as a cheap storage technique (for folding state)
	const menuTree = useMemo(() => buildNavigationTree(), []);
	// storage for current folder/expanded tree items
	const [foldedItemState, setFoldedItemState] = useState<MenuChildNode[]>(
		menuTree.initialUnfolded
	);
	// storage for search item state
	const [searchItemState, setSearchItemState] = useState<NavSearchValue>({
		userQuery: null,
		displayMatches: [],
		literalMatches: [],
	});

	function onFoldAction(itemRef: MenuChildNode) {
		if (foldedItemState.includes(itemRef)) {
			// fold
			setFoldedItemState(
				foldedItemState.filter((cachedItemRef) => cachedItemRef !== itemRef)
			);
		} else {
			// expand
			setFoldedItemState([...foldedItemState, itemRef]);
		}
	}

	// Use a different folding state when displaying search results
	const displayFoldedState = searchItemState.displayMatches.length
		? searchItemState.displayMatches
		: foldedItemState;

	const customLogoUrl = config.uiOptions && config.uiOptions.logoUrl;

	return (
		<header className="am-header">
			<div className="am-header__logo">
				{customLogoUrl ? (
					<img className="am-logo-custom" src={customLogoUrl} />
				) : (
					<AmLogo scale={0.4} />
				)}
			</div>
			<NavSearch
				value={searchItemState}
				menuTree={menuTree}
				onChange={(newState) => setSearchItemState(newState)}
			/>
			<nav className="am-header__nav">
				{recursiveRenderTree(menuTree, 0, {
					onFoldAction,
					foldedItemState: displayFoldedState,
					literalMatches: searchItemState.literalMatches,
				})}
			</nav>
		</header>
	);
}

function recursiveRenderTree(
	menuTree: MenuAnyNode,
	level: number,
	itemProps: any
) {
	return (
		<ul className="am-header__nav-menu">
			{menuTree.children.map((childItem: MenuChildNode) => {
				// invert this for reverse expanded state
				const isExpanded = itemProps.foldedItemState.includes(childItem);

				const items = [
					<NavItem
						level={level}
						item={childItem}
						isFolded={!isExpanded}
						{...itemProps}
					/>,
				];

				if (isExpanded && childItem.children && childItem.children.length) {
					items.push(recursiveRenderTree(childItem, level + 1, itemProps));
				}

				return items;
			})}
		</ul>
	);
}
