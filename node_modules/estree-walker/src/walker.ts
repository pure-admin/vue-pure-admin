import { BaseNode } from "estree";

export type WalkerContext = {
	skip: () => void;
	remove: () => void;
	replace: (node: BaseNode) => void;
};

export class WalkerBase {
	protected should_skip: boolean = false;
	protected should_remove: boolean = false;
	protected replacement: BaseNode = null;

	public context: WalkerContext = {
		skip: () => (this.should_skip = true),
		remove: () => (this.should_remove = true),
		replace: (node: BaseNode) => (this.replacement = node)
	};

	public replace(parent: any, prop: string, index: number, node: BaseNode) {
		if (parent) {
			if (index !== null) {
				parent[prop][index] = node;
			} else {
				parent[prop] = node;
			}
		}
	}

	public remove(parent: any, prop: string, index: number) {
		if (parent) {
			if (index !== null) {
				parent[prop].splice(index, 1);
			} else {
				delete parent[prop];
			}
		}
	}
}
