// Host styles must be the first style applied
import '@theme-host.scss';
// Any additional static stylesheets applied will be routed to mounted Rifts,
// both isolated and non-isolated
import '@theme-rift.scss';

// Ensure manifest is preloaded with each root
import { entityManifest } from './globals';

if (window === window.top) {
	// running in host (and default for docs in direct mode)
	import('./roots/host');
} else {
	// running in isolated frame (isolated doc mode)
	const entityUuid = document.body.dataset.entityUuid;
	const entityAdapterName = document.body.dataset.entityAdapter;

	// get the currently available adapters by name (and loader)
	const loadAdaptersByName = require('./adapters/adapters').default;

	// Load in isolated rendering dependencies in parallel
	Promise.all([
		// load root for isolated display
		import('./roots/isolated'),
		// load entity
		entityManifest[entityUuid].load(),
		// load adapter
		loadAdaptersByName(entityAdapterName),
	]).then(([m1, loadedEntity, adapter]) => {
		const main = m1.default;
		// bootstrap the isolated entity
		main(entityUuid, loadedEntity, adapter);
	});
}
