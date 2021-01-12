/** @jsx h */
import { h } from 'preact';
import { BEM } from '../../../helpers';

import { config } from '../../globals';
import { TextBoxSearchOutline } from '../Icon/Icon';

import { NavSearchProps } from '@amtypes/client';

export default function NavSearch({
	value,
	menuTree,
	onChange,
}: NavSearchProps) {
	const onChangeInput = (e) => {
		const userQuery = e.target.value;

		// Find exact matches based on naming
		const literalMatches = userQuery
			? menuTree.flattened.filter((node) => {
					return node.name.toLowerCase().includes(userQuery.toLowerCase());
			  })
			: [];

		// Storage for unfolded nodes
		let displayMatches = [];

		// Iterate through each match and add it's parents via ref so we can show it in the nav
		if (literalMatches.length) {
			let index = literalMatches.length;
			let currentMatch;
			let currentNode;

			while (index--) {
				currentMatch = literalMatches[index];
				currentNode = currentMatch;

				while (currentNode) {
					displayMatches.push(currentNode);
					//iterate up parent tree
					currentNode = currentNode.parent;
				}
			}

			// Remove duplicates
			displayMatches = [...new Set(displayMatches)];
		}

		onChange({
			userQuery,
			literalMatches,
			displayMatches,
		});
	};

	return (
		<div className={BEM('am-header-search')}>
			<div className={BEM('am-header-search__wrapper')}>
				<TextBoxSearchOutline size={20} />
				<input
					className={BEM('am-header-search__input')}
					type="text"
					placeholder={config.uiOptions.searchPlaceholder || 'Search docs...'}
					value={value.userQuery || ''}
					onChange={onChangeInput}
				/>
			</div>
		</div>
	);
}
