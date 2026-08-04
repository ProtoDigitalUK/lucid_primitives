import type {
	Store,
	StoreActions,
	StoreInterface,
	StoreState,
} from "../../types/index.js";

const getStoreInterface = <S extends StoreState, A extends StoreActions>(
	store: Store<S, A>,
): StoreInterface<S, A> => ({
	get state() {
		return store.state;
	},
	get actions() {
		return store.actions;
	},
	get refs() {
		return store.refs;
	},
});

export default getStoreInterface;
