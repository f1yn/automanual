import React from 'react';
import styled from '@emotion/styled';

const ButtonWrapper = styled('button')`
	background-color: ${(props) => props.color || '#4aa'};
	color: #fff;
	border: 0;
	padding: 1rem;
`;

export default function EmotionButton({ color }) {
	return (
		<ButtonWrapper color={color}>
			This is a Button with emotion-js
		</ButtonWrapper>
	);
}
