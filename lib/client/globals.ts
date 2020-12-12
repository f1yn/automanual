import { AMClientConfig } from '@amtypes/config';
import { EntityManifest } from '@amtypes/entity';

// @ts-ignore
import loadedEntityManifest from '@manifest.js';
// @ts-ignore
import loadedConfig from '@config.js';

export const config = loadedConfig as AMClientConfig;

export const entityManifest = loadedEntityManifest as EntityManifest;
