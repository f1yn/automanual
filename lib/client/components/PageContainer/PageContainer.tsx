/** @jsx h */
import { h } from 'preact';

export default function PageContainer({
	children,
}: {
	children: preact.ComponentChildren;
}) {
	return <main className="am-container">{children}</main>;
}
