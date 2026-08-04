import type { MemberReference } from "../types/directives.js";

const parseStatePath = (value: string) => {
	const parts = value.match(/[^.\[\]]+|\[([^\]]+)\]/g) ?? [];
	return parts.map((part) =>
		part
			.replace(/^\[/, "")
			.replace(/\]$/, "")
			.replace(/^['"]|['"]$/g, ""),
	);
};

const parseReference = (
	value: string,
	scopeSeparator = ":",
): MemberReference | null => {
	const separatorIndex = value.indexOf(scopeSeparator);
	const hasExplicitScope = separatorIndex > 0;
	if (separatorIndex === 0) return null;

	const scope = hasExplicitScope ? value.slice(0, separatorIndex) : null;
	const member = hasExplicitScope
		? value.slice(separatorIndex + scopeSeparator.length)
		: value;
	if (!member) return null;

	if (member.startsWith("$")) {
		const path = parseStatePath(member.slice(1));
		const key = path.shift();
		if (!key) return null;
		return { raw: value, scope, type: "state", key, path };
	}

	if (member.startsWith("@")) {
		const key = member.slice(1);
		if (!key) return null;
		return { raw: value, scope, type: "action", key, path: [] };
	}

	if (member.startsWith("#")) {
		const key = member.slice(1);
		if (!key) return null;
		return { raw: value, scope, type: "identifier", key, path: [] };
	}

	return null;
};

export default parseReference;
