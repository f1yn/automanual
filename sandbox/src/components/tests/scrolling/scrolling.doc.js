import React from 'react';
import styled from '@emotion/styled';

export default {
	name: 'Tests | Iframe Scroll Sync',
	adapter: 'react',
	config: {
		noHeadings: true,
	},
};

const Center = styled('div')`
	background-color: ${(props) => props.color || '#4aa'};
	color: #fff;
	border: 0;
	padding: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	width: 100%;
	box-sizing: border-box;
`;

const CenterText = styled('h1')`
	margin: 0;
	padding: 0;
	line-height: 1;
	display: block;
	font-size: 9rem;
`;

export const A = () => (
	<Center color={'#dd8'}>
		<CenterText>A</CenterText>
	</Center>
);

export const B = () => (
	<Center color={'#d8d'}>
		<CenterText>B</CenterText>
	</Center>
);

export const C = () => (
	<Center color={'#8dd'}>
		<CenterText>C</CenterText>
	</Center>
);

export const D = () => (
	<Center color={'#8d8'}>
		<CenterText>D</CenterText>
	</Center>
);
