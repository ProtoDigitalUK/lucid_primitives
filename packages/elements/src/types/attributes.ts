// ----------------
// State Attributes

type StateKey = string;

/**
 * Stores the name and value of a state attribute. \
 * Ie: `data-state--disabled="false"` would be stored as `['disabled', 'false']`
 */
export type StateAttribtuesMap = Map<
	StateKey,
	string | number | boolean | null | undefined | object | Array<unknown>
>;

// ----------------
// Bind Attributes

// the name of the attribute the bind creates and maps to
type AttributeName = string;

/**
 * Stores a map of state keys and all of their bind attributes. \
 */
export type BindAttributesMap = Map<StateKey, Set<AttributeName>>;

// ----------------
// Handlers Attributes

type HandlerNamespace = string;
type HandlerSpecifier = string;
type HandlerAction = string;

/**
 * Stores a Map of namespaces, their specifiers and all handlers functions \
 * `data-handler--namesapce.specifier="action"`
 */
export type HandlerAttributesMap = Map<
	HandlerNamespace,
	Map<HandlerSpecifier, Array<HandlerAction>>
>;
