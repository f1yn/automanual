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

const loadedAdapterCache = new Map();

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
