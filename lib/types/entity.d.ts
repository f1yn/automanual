export interface EssentialEntityData {
	name: string;
	adapter?: string;
	isolate?: boolean;
}

export interface PendingEntity {
	name: string;
	type: 'doc' | null;
	namedExports: Array<string>;
	essential: EssentialEntityData;
	contents: string;
	rawLoadStatement: string;
}

export interface FullEntity extends PendingEntity {
	path: string;
	navSections: Array<string>;
}

export interface ClientEntity
	extends FullEntity,
		Omit<FullEntity, 'rawLoadStatement'> {
	load: () => Promise<any>;
}

export interface LoadedEntity {
	default: { [configKey: string]: any };
	[exportKey: string]: any;
}

export interface EntityManifest {
	[entityUuid: string]: ClientEntity;
}
