/** @jsx h */
import { h } from 'preact';

// https://materialdesignicons.com/

// unopened leaf
export const CodeGreaterThan = ({ size = 24 }) => (
	<svg style={`width:${size}px;height:${size}px`} viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M10.41,7.41L15,12L10.41,16.6L9,15.18L12.18,12L9,8.82M5,3C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3H5Z"
		/>
	</svg>
);

// minus box - close tree leaf
export const MinusBox = ({ size = 24 }) => (
	<svg style={`width:${size}px;height:${size}px`} viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M17,13H7V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"
		/>
	</svg>
);

// appsbox - directory/collection of paths
export const AppsBox = ({ size = 24 }) => (
	<svg style={`width:${size}px;height:${size}px`} viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M7,7V9H9V7H7M11,7V9H13V7H11M15,7V9H17V7H15M7,11V13H9V11H7M11,11V13H13V11H11M15,11V13H17V11H15M7,15V17H9V15H7M11,15V17H13V15H11M15,15V17H17V15H15Z"
		/>
	</svg>
);

// code braces box - component definition (edge item)
export const CodeBracesBox = ({ size = 24 }) => (
	<svg style={`width:${size}px;height:${size}px`} viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M11 8H9V10C9 11.1 8.1 12 7 12C8.1 12 9 12.9 9 14V16H11V18H9C7.9 18 7 17.1 7 16V15C7 13.9 6.1 13 5 13V11C6.1 11 7 10.1 7 9V8C7 6.9 7.9 6 9 6H11V8M19 13C17.9 13 17 13.9 17 15V16C17 17.1 16.1 18 15 18H13V16H15V14C15 12.9 15.9 12 17 12C15.9 12 15 11.1 15 10V8H13V6H15C16.1 6 17 6.9 17 8V9C17 10.1 17.9 11 19 11V13Z"
		/>
	</svg>
);

// text box - manual page (edge item)
export const TextBox = ({ size = 24 }) => (
	<svg style={`width:${size}px;height:${size}px`} viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"
		/>
	</svg>
);
