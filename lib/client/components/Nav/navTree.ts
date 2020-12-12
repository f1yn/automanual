import { config, entityManifest } from '../../globals';

import {
	MenuNode,
	MenuEdgeNode,
	MenuRootNode,
	MenuAnyNode,
} from '@amtypes/menu';
import { ClientEntity } from '@amtypes/entity';

export function buildNavigationTree(): MenuRootNode {
	// define root node structure
	const rootNode: MenuRootNode = {
		name: 'root',
		// initially unfolded menu items (used for reset and initial states)
		initialUnfolded: [],
		// reference storage for edge nodes within a tree (not including exports)
		edgeNodes: [],
		// reference storage for each node for efficient search operations
		flattened: [],
		// children nodes
		children: [],
		// mark as having no parent
		parent: null,
	};

	for (const entity of Object.values(entityManifest)) {
		// Reference to current parent item
		let currentParent = rootNode as MenuAnyNode;

		// For each nav item of a given entity, iterate each item in it's tree
		// If it finds an identical match at a given level, the item will be appended
		// to the located nodes children.
		entity.navSections.forEach(
			(name: string, level: number, allSections: string[]) => {
				if (!currentParent.children) {
					currentParent.children = [];
				}

				// create new nested parent
				let targetNode = currentParent.children.find(
					(node) => node.name === name
				);

				if (!targetNode) {
					targetNode = createMenuNode(name, currentParent, rootNode);
					// add to existing parent (might dupe, but is cleaned when folded)
					currentParent.children.push(targetNode);
				}

				// flag new parent node
				currentParent = targetNode;

				if (
					config.uiOptions &&
					typeof config.uiOptions.expandNavToDepth === 'number' &&
					level < config.uiOptions.expandNavToDepth
				) {
					// unfold current item (at level)
					rootNode.initialUnfolded.push(targetNode);
				}

				if (level === allSections.length - 1) {
					// if we're at the end of this line, mark as end node
					markAsEdgeNode(targetNode, entity, rootNode, level);

					// expand tree to a given location (will ensure the currently loaded
					// page will be expanded in the tree view)
					if (window.location.pathname === entity.path) {
						let nodeRef = targetNode as MenuAnyNode;

						while (nodeRef.parent) {
							rootNode.initialUnfolded.push(nodeRef);
							// go to parent
							nodeRef = nodeRef.parent;
						}
					}
				}
			}
		);
	}

	// Apply sorting mechanism to each sibling tree
	applyBottomUpSort(rootNode);
	return rootNode;
}

function markAsEdgeNode(
	node: Partial<MenuEdgeNode>,
	entity: ClientEntity,
	rootNode: MenuRootNode,
	level: number
) {
	if (
		config.uiOptions &&
		config.uiOptions.showIndividualExports &&
		entity.namedExports.length
	) {
		// Add named exports (use literal sort order for exports)
		node.children = [];

		let index = entity.namedExports.length;
		let name;
		let item;

		while (index--) {
			name = entity.namedExports[index];
			item = createMenuNode(
				name,
				node as MenuEdgeNode,
				rootNode
			) as MenuEdgeNode;
			item.targetEntityPath = entity.path + '#' + name;
			item.tree = [...entity.navSections, name];
			node.children.push(item);
		}
	} else {
		node as MenuEdgeNode;
		// Use as default end node
		node.targetEntityPath = entity.path;
		node.tree = entity.navSections;
	}

	node.level = level;

	// Mark edge node form bottom up recursive sorting
	rootNode.edgeNodes.push(node as MenuEdgeNode);
}

// sorting mechanism that applies itself from the known edges of the tree and goes
// upwards towards the root node
function applyBottomUpSort(rootNode: MenuRootNode) {
	let currentEdgeNodeIndex = rootNode.edgeNodes.length;

	let currentEdgeNode;
	let currentParentNode;
	let currentLevelIndex;

	while (currentEdgeNodeIndex--) {
		currentEdgeNode = rootNode.edgeNodes[currentEdgeNodeIndex];

		// set the current parent to the edge node
		currentParentNode = currentEdgeNode;

		// Get the level index
		currentLevelIndex = config.uiOptions.showIndividualExports
			? currentEdgeNode.level + 1
			: currentEdgeNode.level;

		while (currentParentNode) {
			// Only sort parent that haven't been sorted yet
			if (!currentParentNode.sorted && currentParentNode.children) {
				// Apply sort mutation based on config sidebar helper
				currentParentNode.children.sort((a, b) =>
					config.uiOptions.sortSidebar(a, b, currentLevelIndex)
				);
			}

			// Flag as sorted
			currentParentNode.sorted = true;

			// iterate to next parent
			currentParentNode = currentParentNode.parent;
			currentLevelIndex -= 1;
		}
	}
}

function createMenuNode(
	name: string,
	parent: MenuAnyNode,
	rootNode: MenuRootNode
): MenuNode {
	const node = { name, parent, children: [] };

	// Cache ref in flattened representation of tree
	rootNode.flattened.push(node);
	// Return ref
	return node;
}
