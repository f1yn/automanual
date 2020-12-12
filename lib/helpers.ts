export const chunk = (
	arr: Array<any>,
	chunkSize: number = 1,
	cache: Array<any> | null = []
) => {
	const tmp = [...arr];
	if (chunkSize <= 0) return cache;
	while (tmp.length) cache.push(tmp.splice(0, chunkSize));
	return cache;
};

// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Do_not_ever_use_eval!
export const evaluateObject = (objectAsString: string): { [k: string]: any } =>
	Function('"use strict";return (' + objectAsString + ')')();

export const toTitleCase = (str: string): string =>
	str.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	);

export const bemify = (baseClass: string) => {
	const classes = [baseClass.trim()];
	const getClassName = () => classes.join(' ');

	getClassName.mod = (modifierToAdd) => {
		const add = typeof modifierToAdd === 'string' ? modifierToAdd.trim() : '';
		if (add) classes.push(`${classes[0]}--${add}`);
	};

	return getClassName;
};

export const BEM = (baseClass: string, ...modifiers: Array<string>) => {
	const classes = [baseClass.trim()];

	let index = modifiers.length;
	let mod;

	while (index--) {
		mod = typeof modifiers[index] === 'string' ? modifiers[index].trim() : '';
		if (mod) classes.push(`${classes[0]}--${mod}`);
	}

	return classes.join(' ');
};
