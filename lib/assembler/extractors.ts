/**
 * Removes any whitespace characters from a string before extracting helpful context
 * @param line The line or string to be processed
 * @returns {String} The reduced string
 */
const reduceLine = (line: string) => line.replace(/\s/g, '');

/**
 * Checks via approximation if a given line in a reduced object starts with a given key
 * @param trimmedLine The trimmed line from the object literal expression
 * @param keyName The key to look for
 * @returns {boolean} Returns true if the key definition is found on the provided line
 */
const lineIncludesKey = (trimmedLine: string, keyName: string): boolean =>
	trimmedLine.startsWith(`${keyName}:`) ||
	trimmedLine.startsWith(`'${keyName}:'`) ||
	trimmedLine.startsWith(`"${keyName}":`);

/**
 * Extracts the usable portions of a doc file's default exports and extracts them
 * @param contents The string contents of the doc file
 * @returns {String} The processed export (ready for serialization)
 */
export function determineDefaultExport(
	contents: string,
	relativePath: string
): string {
	// Since babel is rude, and tries to (test) everything it touches, just focus on using static analysis
	// to manually extract the correct line.
	const contentsAsLines = contents.split('\n');

	const startDefaultExportLineIndex = contentsAsLines.findIndex((line) =>
		line.startsWith('export default {')
	);

	if (startDefaultExportLineIndex === -1) {
		throw new Error(
			`Failed to locate default exports for file ${relativePath}`
		);
	}

	const testEndLine = /^}(|;)$/;

	const endDefaultExportLine = contentsAsLines
		.slice(startDefaultExportLineIndex)
		.findIndex((line) => testEndLine.test(line));

	if (endDefaultExportLine === -1) {
		throw new Error(
			`Failed to locate closing part of default export for file ${relativePath}. Please format the file correctly`
		);
	}

	// Use range markers to extract default export
	const originalDefaultExportSourceAsLines = contentsAsLines.slice(
		startDefaultExportLineIndex,
		// endDefaultExport is offset by starting index, and must include the suspect line
		startDefaultExportLineIndex + endDefaultExportLine + 1
	);

	const filteredExportSourceAsLines = originalDefaultExportSourceAsLines
		.join('\n')
		// remove default export
		.replace(/^export default /, '')
		// remove trailing semicolon(s)
		.replace(/;$/, '')
		.split('\n')
		.filter((line) => {
			const trimmedLine = reduceLine(line);

			// Only pull required values
			return (
				lineIncludesKey(trimmedLine, 'name') ||
				lineIncludesKey(trimmedLine, 'adapter') ||
				lineIncludesKey(trimmedLine, 'isolate') ||
				trimmedLine.startsWith('{') ||
				trimmedLine.endsWith('}')
			);
		});

	return filteredExportSourceAsLines.join('\n');
}

const normalExportDetect = /export(const|function)([a-zA-Z0-9_]+)/g;
const groupExportDetect = /export\{([a-zA-Z0-9_,]+)\}/g;
const normalExportDetectIndividual = /export(const|function)([a-zA-Z0-9_]+)/;
const groupExportDetectIndividual = /export\{([a-zA-Z0-9_,]+)\}/;

/**
 * Determines the named exports from a documentation file
 * @param contents The string contents of the doc file
 * @returns {String[]} Array of named exports approximated for a given doc contents
 */
export function determineNamedExports(content: string): Array<string> {
	const reducedContent = reduceLine(content);

	const detectedNamedExports = [];

	const normalMatches = reducedContent.match(normalExportDetect);
	const groupMatches = reducedContent.match(groupExportDetect);

	let index = normalMatches ? normalMatches.length : 0;
	while (index--) {
		// add named export
		detectedNamedExports.push(
			normalMatches[index].match(normalExportDetectIndividual)[2]
		);
	}

	index = groupMatches ? groupMatches.length : 0;
	let match;
	while (index--) {
		match = groupMatches[index].match(groupExportDetectIndividual)[1];
		detectedNamedExports.push(...match.split(','));
	}

	return detectedNamedExports.filter(Boolean);
}
