import { ClientEntity, LoadedEntity } from '@amtypes/entity';
import { AMAdaptor } from '@amtypes/adaptor';
import { MenuAnyNode, MenuChildNode, MenuRootNode } from '@amtypes/menu';

export interface DocProps {
	readonly entity: ClientEntity;
	readonly entityUuid: string;
	selfRef?: HTMLIFrameElement;
	preloadedEntity?: LoadedEntity;
	preloadedAdapter?: AMAdaptor;
	isolated?: boolean;
}

export interface DocEntityProps {
	readonly entityUuid: string;
	readonly decorators: Array<Function>;
	name: string;
	adapter: AMAdaptor;
	component: any;
}

export interface DocConfiguration {
	noHeadings: boolean;
}

export interface NavItemProps {
	item: MenuChildNode;
	level: number;
	isFolded: boolean;
	onFoldAction: (item: MenuAnyNode) => void;
	literalMatches: Array<MenuAnyNode>;
}

export interface NavItemContentProps {
	item: MenuChildNode;
	level: number;
	isFolded: boolean;
	isSearchHighlighted: boolean;
}

export interface NavSearchValue {
	userQuery: string;
	literalMatches: Array<MenuChildNode>;
	displayMatches: Array<MenuChildNode>;
}

export interface NavSearchProps {
	value: NavSearchValue;
	menuTree: MenuRootNode;
	onChange: (payload: NavSearchValue) => void;
}

export interface IconGetterProps {
	item: MenuChildNode;
	isFolded: boolean;
}

export interface RiftProps {
	readonly path: string;
	readonly entity: ClientEntity;
	readonly entityUuid: string;
}
