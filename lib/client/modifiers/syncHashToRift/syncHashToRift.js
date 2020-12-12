// current live iframe roots
const registeredRiftRefs = new Set();

let currentHashState = null;

function reconcileHashChange(hash) {
	currentHashState = hash;
	if (!hash) return;

	// Apply hash to each active Rift
	registeredRiftRefs.forEach((riftRef) => {
		riftRef.frame.location.hash = hash;
	});
}

const asyncHashToRift = {
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
