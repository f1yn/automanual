import { config } from '../globals';

import { AMAdaptor } from '@amtypes/adaptor';
import { ClientEntity } from '@amtypes/entity';

// We only load in adapters as they are needed
const adapterMap = {
	react: () => import('./reactAdaptor'),
	preact: () => import('./preactAdapter'),
	mdx: () => import('./mdxAdapter'),
	html: () => import('./htmlAdapter'),
	// TODO: VUE + Angular?
};

// Cache storage for loaded adapters
const loadedAdapterCache = new Map();

/**
 * Load adapter by name. If already cached, bypass Promise and return synchronously.
 * @param name The name of the adapter to attempt to load
 */
export default (name: string): AMAdaptor | Promise<AMAdaptor> =>
	// Get from cache (shorted sync)
	loadedAdapterCache.get(name) ||
	// Otherwise load adapter (async)
	new Promise((resolve, reject) =>
		adapterMap[name]()
			.then((adapterMod) => {
				loadedAdapterCache.set(name, adapterMod.default);
				resolve(adapterMod.default);
			})
			.catch(reject)
	);

export const getAdapterNameFromEntity = (entity: ClientEntity): string =>
	entity.essential.adapter || config.defaultAdapter;
