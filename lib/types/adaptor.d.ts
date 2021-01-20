import { LoadedEntity } from '@amtypes/entity';

export interface AMAdaptor<CompType = any> {
	onMount: (
		containerRef: HTMLDivElement,
		component: CompType,
		decorators: Array<(i: CompType) => CompType>
	) => any;
	onUnmount: (containerRef: HTMLDivElement, component: CompType) => void;
	resolvePropDataFromEntity: (entity: LoadedEntity) => Promise<AMPropData>;
}

export interface AMPropData {
	[key: string]: any;
}
