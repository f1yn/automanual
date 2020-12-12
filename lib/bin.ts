#!/usr/bin/env node
require = require('esm')(module);

// Set global flag so we know we are in CLI mode instead of api mode
global['__automanual_isCLI'] = true;
module.exports = require('./assembler/main');
