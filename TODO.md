# Pre-release TODO

- [x] Sync host hash with rift frame onload and during changes
- [x] Add search ability
- [x] Add color code ability for navigation
- [x] Add ability to modify the head of host and parent
- [x] Enable rebuilding of manifest on the fly
- [x] Enable rebuilding of the config on the fly
- [x] Ensure that minimum expanded depth can be changed/used
- [x] Add html support
- [x] Add preact support
- [x] Add ability to sort sidebar items (by depth + parent)
- [x] Move loading state into context/provider
- [x] Ensure that window in rift matched the window of the frame, not the parent
- [ ] Add ability to define custom adapters/modifiers/and plugins.
- [ ] Add propTable support (inject into entity def) (and integrate into search)
- [ ] Add validation at specified TODO locations
- [x] Add custom logo support
- [ ] Add alternate ui theme "tile" (maybe)
- [x] Add theming ability (point to css for host and frame)
- [ ] Enable ability to load mdx files without sibling doc.js files

- [ ] Add custom adapter wiki guide
- [ ] Add custom plugin wiki guide
- [ ] Add custom modifier wiki guide
- [ ] Add best (opinionated) practices wiki guide

# Post-release TODO

- [ ] Enable ability to point to filesystem to import documentation.js HTML output
- [ ] Do the above through a custom adapter type which will inject each html file into
a hotloaded chunk. Uses a single manifest entry, but spreads to many others.