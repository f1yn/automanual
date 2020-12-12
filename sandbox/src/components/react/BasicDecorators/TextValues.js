import React from 'react';

export default ({ level = 3, text }) => {
	const Heading = `h${level}`;

	return (<Heading>{text}</Heading>)
}