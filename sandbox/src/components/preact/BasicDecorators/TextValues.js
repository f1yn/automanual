/** @jsx h */
import { h } from 'preact';

export default ({ level = 3, text }) => {
	const Heading = `h${level}`;

	return (<Heading>{text}</Heading>)
}