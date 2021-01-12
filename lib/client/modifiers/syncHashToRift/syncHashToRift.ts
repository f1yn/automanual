import { AMModifier, RiftInstance } from '@amtypes/modifier';

// current live iframe roots
const registeredRiftRefs = new Set<RiftInstance>();

let currentHashState = null;

function reconcileHashChange(hash: string): void {
	currentHashState = hash;
	if (!hash) return;

	// Apply hash to each active Rift
	registeredRiftRefs.forEach((riftRef) => {
		riftRef.frame.location.hash = hash;
	});
}

const asyncHashToRift: AMModifier = {
	id: 'sync-hash',
	onMount(riftRef) {
		reconcileHashChange(window.location.hash);
		registeredRiftRefs.add(riftRef);
		return { active: true };
	},
	onUnmount(riftRef) {
		registeredRiftRefs.delete(riftRef);
	},
	onRender() {
		const hash = window.location.hash;

		if (hash !== currentHashState) {
			reconcileHashChange(hash);
		}
	},
};

export default asyncHashToRift;
