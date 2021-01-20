/** @jsx h */
import { h } from 'preact';
import PropTypes from 'prop-types';

export default function TextValues({ level = 3, text }) {
	const Heading = `h${level}`;
	return <Heading>{text}</Heading>;
}

TextValues.propTypes = {
	level: PropTypes.number,
	text: PropTypes.oneOf([PropTypes.string, PropTypes.bool]),
};
