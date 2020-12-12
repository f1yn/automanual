import {
	EssentialEntityData,
	FullEntity,
	PendingEntity,
} from '@amtypes/entity.d';

import { AMConfiguration } from '@amtypes/config.d';

import fs from 'fs';
import path from 'path';
import util from 'util';

import { v4 as uuid } from 'uuid';
import serialize from 'serialize-javascript';

import { chunk, evaluateObject } from '../helpers';
import { determineDefaultExport, determineNamedExports } from './extractors';

const readFile = util.promisify(fs.readFile);

/**
 * Loads and (lightly) processes a glob-matched file, and extrapolates any essential meta data into a set
 * @param cwd
 * @param relativePath
 * @param options
 * @return {Promise<{importStatement: string, pathKey: *, type: string}>}
 */
async function parseAndProcessEntity(
	cwd: string,
	relativePath: string,
	options: AMConfiguration
): Promise<FullEntity> {
	const fullPath = path.join(cwd, relativePath);
	const contents = await readFile(fullPath, 'utf-8');

	// Determine the (usable default export) of a given doc file
	const filteredDefaultExport = determineDefaultExport(contents, relativePath);

	// Determine named exports
	const namedExports = determineNamedExports(contents);

	// Parse the object
	const essential = evaluateObject(
		filteredDefaultExport
	) as EssentialEntityData;

	// Generate entity
	const entity: PendingEntity = {
		name: essential.name,
		// TODO: determine type automatically
		type: 'doc',
		namedExports,
		essential,
		contents,
		// Generate the raw import statement. Convert before injecting
		rawLoadStatement: `() => import(${JSON.stringify(fullPath)})`,
	};

	// TODO: validate entity for non-corruption before returning

	return {
		...entity,
		path: options.pathKey(entity),
		navSections: determineSections(entity, options.sectionDivider || /[|\/]/g),
	};
}

export async function generateRoutingEntitiesFromPaths(
	cwd: string,
	matchedPaths: Array<string>,
	options: AMConfiguration
): Promise<Array<FullEntity>> {
	const processedEntities = [];

	for (const groupOfPaths of chunk(matchedPaths, 20)) {
		// Load and parse files in batches
		const parsedFiles = await Promise.all(
			groupOfPaths.map((relativePath) =>
				parseAndProcessEntity(cwd, relativePath, options)
			)
		);

		processedEntities.push(...parsedFiles);
	}

	// TODO: use babel parse to decode exports and cache source
	// TODO: dedupe and flag duplicates
	return processedEntities;
}

/**
 * Generates the manifest file injected into webpack virtually during the build process.
 */
export function generateManifestAsString(
	routingEntities: Array<FullEntity>
): string {
	const manifestTemplate = `module.exports = {\n/* INJECT_MANIFEST */}`;

	// prepare chunked series of object entities
	const manifestChunks = [];

	for (const originalEntity of routingEntities) {
		const entity = { ...originalEntity };

		// Remove raw import statement ref
		const rawLoadStatement = entity.rawLoadStatement;
		delete entity.rawLoadStatement;

		// generate entity into an injectable string, but in the form of lines
		const serializedLines = serialize(entity, {
			space: '\t',
			// isJSON: true,
		}).split('\n');

		// Add separator to enable additional line to be added to project
		serializedLines[serializedLines.length - 2] += ',';

		// Inject the import statement as the final line
		serializedLines.splice(
			serializedLines.length - 1,
			0,
			`\tload: ${rawLoadStatement},`
		);

		manifestChunks.push(`'${uuid()}': ${serializedLines.join('\n')},`);
	}

	return manifestTemplate.replace(
		'/* INJECT_MANIFEST */',
		manifestChunks.join('\n')
	);
}

function determineSections(
	entity: PendingEntity,
	regexpOrString: RegExp | string
) {
	return entity.name.split(regexpOrString).map((i) => i.trim());
}
