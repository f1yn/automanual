/** @jsx h */
import { h, Fragment, render } from 'preact';
import Router from 'preact-router';

// @ts-ignore
import { entityManifest } from '../globals';

import Nav from '../components/Nav/Nav';
import PageContainer from '../components/PageContainer/PageContainer';
import Rift from '../components/Rift/Rift';

// Running in host mode
function AutomanualCoreSwitch() {
	return (
		<Router>
			{Object.entries(entityManifest).map(([entityUuid, entity]) => (
				<Rift
					path={entity.path}
					key={entityUuid}
					entity={entity}
					entityUuid={entityUuid}
				/>
			))}
		</Router>
	);
}

function Automanual() {
	return (
		<Fragment>
			<Nav />
			<PageContainer>
				<AutomanualCoreSwitch />
			</PageContainer>
		</Fragment>
	);
}

render(<Automanual />, document.getElementById('automanual-root'));
