import { ClientEntity } from '@amtypes/entity';

export interface RiftInstance {
	entityUuid: string;
	entity: ClientEntity;
	frame: Window | null;
	doc: Document | null;
	isolated: boolean;
}

export interface AMModifier {
	id: string;
	onMount: (riftRef: RiftInstance) => { [k: string]: any } | void;
	onUnmount: (riftRef: RiftInstance) => void;
	onRender?: () => void;
}
