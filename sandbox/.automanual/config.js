export default {
	title: 'Automanual',
	uiOptions: {
		firstLayerAsHeading: true,
		showIndividualExports: true,
		expandNavToDepth: 1,
		sortSidebar(a, b, _level) {
			return a.name.localeCompare(b.name);
		}
	}
}