export type MemberReferenceType = "action" | "identifier" | "state";

export type MemberReference = {
	raw: string;
	scope: string;
	type: MemberReferenceType;
	key: string;
	path: string[];
};

export type HandlerDirective = {
	element: Element;
	handler: string;
	attributeName: string;
	specifier: string;
	value: string;
	reference: MemberReference | null;
	synthetic: boolean;
};
