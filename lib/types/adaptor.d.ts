import { FunctionalComponent } from 'preact';

export interface AMAdaptor {
	onMount: (
		containerRef: HTMLDivElement,
		component: FunctionalComponent | ((any) => any),
		decorators: Array<Function>
	) => any;
	onUnmount: (containerRef: HTMLDivElement, component: any) => void;
}
