export interface MenuNode {
	name: string;
	parent: MenuAnyNode | null;
	children: MenuChildrenList;
	sorted?: boolean;
	level?: number;
	// can sometimes be assigned to non-edge nodes
	targetEntityPath?: string;
}

export interface MenuEdgeNode extends MenuNode {
	tree?: Array<string>;
}

export type MenuChildNode = MenuEdgeNode | MenuNode;

export type MenuAnyNode = MenuRootNode | MenuChildNode;

export type MenuChildrenList = Array<MenuChildNode>;

export interface MenuRootNode extends MenuNode {
	initialUnfolded: MenuChildrenList;
	edgeNodes: Array<MenuEdgeNode>;
	flattened: MenuChildrenList;
	children: MenuChildrenList;
}
