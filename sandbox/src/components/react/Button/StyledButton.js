import React from 'react';
import styled from 'styled-components';

const ButtonWrapper = styled.button`
    background-color: ${props => props.color || '#4aa'};
    color: #fff;
    border: 0;
    padding: 1rem;
`;

export default function StyledButton({ color }) {
	return (
		<ButtonWrapper color={color}>
			This is a Button with styled-components
		</ButtonWrapper>
	);
}