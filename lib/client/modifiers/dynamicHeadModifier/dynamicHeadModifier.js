export default function createSingletonDynamicHeadProxy() {
	if (window.top !== window) {
		// Avoid using plugin when the frame is isolated
		return {
			onMount() {},
			onUnmount(riftRef) {},
		};
	}

	// current live iframe roots
	const registeredRiftRefs = new Set();

	// complex cache of entityUuid to their static head nodes
	// needed for remounting due to es/css module complexity
	const headNodeCache = {};

	function stashHeadNodesForEntity(entityUuid, headElement) {
		if (!headNodeCache[entityUuid]) {
			headNodeCache[entityUuid] = [];
		}

		// detect if node object signature isn't already stored (slower oT)
		if (!headNodeCache[entityUuid].includes(headElement)) {
			headNodeCache[entityUuid].push(headElement);
		}
	}

	function applyExistingHead({ frame, entityUuid }) {
		if (!headNodeCache[entityUuid]) return;

		headNodeCache[entityUuid].forEach((headNodeSource) => {
			const headElement = headNodeSource.cloneNode(true);
			frame.document.head.appendChild(headElement);

			// clone styles over
			if (headNodeSource.tagName === 'STYLE' && headNodeSource.sheet) {
				for (
					let index = 0;
					index < headNodeSource.sheet.rules.length;
					index++
				) {
					headElement.sheet.insertRule(
						headNodeSource.sheet.rules[index].cssText
					);
				}
			}
		});
	}

	// document head cloning helper
	const observer = new MutationObserver((mutationList) => {
		// set collection of added nodes
		const allAddedNodes = [];

		mutationList.forEach((mutation) =>
			allAddedNodes.push(...mutation.addedNodes)
		);

		registeredRiftRefs.forEach((riftRef) =>
			allAddedNodes.forEach((baseOriginalNode) => {
				const originalNode = baseOriginalNode.dataset.amStyleTemp
					? baseOriginalNode.__amStyleTempNode
					: baseOriginalNode;

				const clonedNode = originalNode.cloneNode(true);

				riftRef.frame.document.head.appendChild(clonedNode);
				stashHeadNodesForEntity(riftRef.entityUuid, originalNode);
			})
		);
	});

	const originalInsertRuleRef = CSSStyleSheet.prototype.insertRule;

	function customInsertRule(rule, index) {
		// apply styles to top level to ensure non-breakage
		originalInsertRuleRef.apply(this, [rule, index]);

		// apply to each root
		registeredRiftRefs.forEach((riftRef) => {
			console.log(riftRef);
			riftRef.frame.amStyleRoot.sheet.insertRule(rule, index);
		});
	}

	// bind observers/prototype overrides
	observer.observe(window.top.document.head, { childList: true });
	window.top.CSSStyleSheet.prototype.insertRule = customInsertRule;

	return {
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
