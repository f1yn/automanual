import React, { useEffect } from 'react';
import EmotionButton from './EmotionButton';
import StyledButton from './StyledButton';

export default {
	name: 'React | Button | Styled',
	component: StyledButton,
	adapter: 'react',
};

export const Default = () => {
	return <EmotionButton />;
};

export const GreenButton = () => {
	return <EmotionButton color={'green'} />;
};

export const StyledDefault = () => {
	return <StyledButton />;
};

export const StyledGreenButton = () => {
	return <StyledButton color={'green'} />;
};
