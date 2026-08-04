export type StoreMemberReferenceType = "action" | "identifier" | "state";
export type LoopMemberReferenceKey = "index" | "indexOne" | "item";
export type MemberReferenceType = StoreMemberReferenceType | "loop";

export type StoreMemberReference = {
	raw: string;
	scope: string | null;
	type: StoreMemberReferenceType;
	key: string;
	path: string[];
};

export type LoopMemberReference = {
	raw: string;
	scope: null;
	type: "loop";
	key: LoopMemberReferenceKey;
	path: string[];
	value: unknown;
};

export type MemberReference = LoopMemberReference | StoreMemberReference;

export type Directive = {
	element: Element;
	reaction: string;
	attributeName: string;
	specifier: string;
	value: string;
	reference: MemberReference | null;
	synthetic: boolean;
};
