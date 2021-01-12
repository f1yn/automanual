/**
 * Apply decorators generically to an initial render.
 * @param initialRender
 * @param decorators Array of the decorators to apply
 */
export function applyDecorators<CompType>(
	initialRender: CompType,
	decorators: Array<(i: any) => any>
): () => CompType {
	return function () {
		let finalRender = initialRender;

		if (!decorators || !decorators.length) return finalRender;

		let index = decorators.length;
		while (index--) {
			finalRender = decorators[index](finalRender);
		}

		return finalRender;
	};
}
