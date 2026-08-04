export type MemberReferenceType = "action" | "identifier" | "state";

export type MemberReference = {
	raw: string;
	scope: string;
	type: MemberReferenceType;
	key: string;
	path: string[];
};

export type Directive = {
	element: Element;
	reaction: string;
	attributeName: string;
	specifier: string;
	value: string;
	reference: MemberReference | null;
	synthetic: boolean;
};
