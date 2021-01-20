import { AMModifier, RiftInstance } from '@amtypes/modifier';

export default function createSingletonDynamicHeadProxy(): AMModifier {
	if (window.top !== window) {
		// Avoid using plugin when the frame is isolated
		return {
			id: 'head-modify',
			onMount() {},
			onUnmount() {},
		};
	}

	// Helper for resolving the real styles from a cached style (via webpack inject helper)
	const getStyleNodeFromNode = (node: HTMLElement) =>
		node.dataset.amStyleTemp ? node['__amStyleTempNode'] : node;

	// current live iframe roots
	const registeredRiftRefs = new Set<RiftInstance>();

	// complex cache of entityUuid to their static head nodes
	// needed for remounting due to es/css module complexity
	const headNodeCache = {};

	// complex cache of dynamically added rules
	const addedRulesCache = {};

	// Get initial set of node to apply based on the host window's head
	// Any additional (static) style imports in the root application will be stored here
	const globalHeadNodes = Array.from(
		document.head.querySelectorAll('meta[data-am-style-temp="true"]')
	).map(getStyleNodeFromNode);

	// Stash nodes on a per-entity basis. Used as a workaround for the one-off application
	// of css modules and imports as webpack modules (they can't be invalidated without
	// weird af black magic).
	function stashHeadNodesForEntity(
		entityUuid: string,
		headElement: HTMLElement
	) {
		if (!headNodeCache[entityUuid]) {
			headNodeCache[entityUuid] = [];
		}

		// detect if node object signature isn't already stored (slower oT)
		if (!headNodeCache[entityUuid].includes(headElement)) {
			headNodeCache[entityUuid].push(headElement);
		}
	}

	// Applies existing cached nodes to a given rift frame
	function applyExistingHead({ frame, entityUuid }) {
		// Get all recognized global styles nodes to apply
		const headNodesToApply = [
			...globalHeadNodes,
			...(headNodeCache[entityUuid] || []),
		];

		// Frame styles (from the theme) will typically mean this line will be ignore
		// Still, we'll check this in case someone disables this in their configuration
		if (!headNodesToApply.length) return;

		// batch head items together to avoid weird behaviors
		const fragment = frame.document.createDocumentFragment();

		headNodesToApply.forEach((headNodeSource) => {
			const isStyleElement = headNodeSource.tagName === 'STYLE';

			// If we are dealing with a style element, create a new one
			// otherwise clone the existing element
			const headElement = isStyleElement
				? document.createElement('style')
				: headNodeSource.cloneNode(true);

			// clone styles over
			if (isStyleElement) {
				// Don't add sheet styles (as they are tracked separately)
				if (headElement.sheet) return;

				// Ensure that physical styles are carried over, otherwise ensure that
				// sheet is correctly initialised for the cloned style element
				headElement.innerHTML = headNodeSource.innerHTML || '';
			}

			fragment.appendChild(headElement);
		});

		// Inject any dynamically generated rules for this doc page
		const rules = addedRulesCache[entityUuid];

		if (rules) {
			for (let index = 0; index < rules.length; index++) {
				frame['amStyleRoot'].sheet.insertRule(rules[index], undefined, true);
			}
		}

		// Apply all styles at once (best effort to avoid reflow issues)
		frame.document.head.appendChild(fragment);
	}

	// document head cloning helper
	const observer = new MutationObserver((mutationList) => {
		// set collection of added nodes
		const allAddedNodes = [];

		mutationList.forEach((mutation) =>
			allAddedNodes.push(...mutation.addedNodes)
		);

		registeredRiftRefs.forEach((riftRef) => {
			// batch head items together to avoid weird behaviors
			const fragment = riftRef.frame.document.createDocumentFragment();

			allAddedNodes.forEach((baseOriginalNode) => {
				const originalNode = getStyleNodeFromNode(baseOriginalNode);
				const clonedNode = originalNode.cloneNode(true);

				fragment.appendChild(clonedNode);
				stashHeadNodesForEntity(riftRef.entityUuid, originalNode);
			});

			// Apply all styles at once (best effort to avoid reflow issues)
			riftRef.frame.document.head.appendChild(fragment);
		});
	});

	// Hijacks the original top-level stylesheet prototype and intercepts
	// any rules being applied dynamically. This allows us to basically apply
	// all added css rules in a non-isolated environment to each active frame
	// retrospectively
	const originalInsertRuleRef =
		window.top['CSSStyleSheet'].prototype.insertRule;

	function customInsertRule(rule, index, selfCall) {
		// Avoid (potential) recursion if this module is forced to re-init
		if (selfCall) return;

		// apply styles to top level to ensure non-breakage
		originalInsertRuleRef.apply(this, [rule, index, true]);

		// apply to each root
		registeredRiftRefs.forEach((riftRef) => {
			if (!addedRulesCache[riftRef.entityUuid]) {
				addedRulesCache[riftRef.entityUuid] = [];
			}
			addedRulesCache[riftRef.entityUuid].push(rule);
			riftRef.frame['amStyleRoot'].sheet.insertRule(rule, undefined, true);
		});

		return index;
	}

	// bind observers/prototype overrides
	observer.observe(window.top.document.head, { childList: true });
	window.top['CSSStyleSheet'].prototype.insertRule = customInsertRule;

	return {
		id: 'head-modify',
		onMount(riftRef) {
			applyExistingHead(riftRef);
			registeredRiftRefs.add(riftRef);
			return { active: true };
		},
		onUnmount(riftRef) {
			registeredRiftRefs.delete(riftRef);
		},
	};
}
