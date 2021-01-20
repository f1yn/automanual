import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ButtonWrapper = styled.button`
	background-color: ${(props) => props.color || '#4aa'};
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

StyledButton.propTypes = {
	color: PropTypes.string.isRequired,
	shape: PropTypes.shape({
		something: PropTypes.string,
	}),
};
