import { WalkerBase, WalkerContext } from "./walker";
import { BaseNode } from "estree";

export type AsyncWalker = {
	enter?: AsyncWalkerHandler;
	leave?: AsyncWalkerHandler;
};

export type AsyncWalkerHandler = (
	this: WalkerContext,
	node: BaseNode,
	parent: BaseNode,
	key: string,
	index: number
) => Promise<void>;

export class AsyncWalkerClass extends WalkerBase {
	protected enter: AsyncWalker["enter"];
	protected leave: AsyncWalker["leave"];

	constructor(walker: AsyncWalker) {
		super();
		this.enter = walker.enter;
		this.leave = walker.leave;
	}

	public async visit(
		node: BaseNode,
		parent: BaseNode,
		enter: AsyncWalkerHandler,
		leave: AsyncWalkerHandler,
		prop?: string,
		index?: number
	): Promise<BaseNode> {
		if (node) {
			if (enter) {
				const _should_skip = this.should_skip;
				const _should_remove = this.should_remove;
				const _replacement = this.replacement;
				this.should_skip = false;
				this.should_remove = false;
				this.replacement = null;

				await enter.call(this.context, node, parent, prop, index);

				if (this.replacement) {
					node = this.replacement;
					this.replace(parent, prop, index, node);
				}

				if (this.should_remove) {
					this.remove(parent, prop, index);
				}

				const skipped = this.should_skip;
				const removed = this.should_remove;

				this.should_skip = _should_skip;
				this.should_remove = _should_remove;
				this.replacement = _replacement;

				if (skipped) return node;
				if (removed) return null;
			}

			for (const key in node) {
				const value = (node as any)[key];

				if (typeof value !== "object") {
					continue;
				} else if (Array.isArray(value)) {
					for (let i = 0; i < value.length; i += 1) {
						if (value[i] !== null && typeof value[i].type === 'string') {
							if (!(await this.visit(value[i], node, enter, leave, key, i))) {
								// removed
								i--;
							}
						}
					}
				} else if (value !== null && typeof value.type === "string") {
					await this.visit(value, node, enter, leave, key, null);
				}
			}

			if (leave) {
				const _replacement = this.replacement;
				const _should_remove = this.should_remove;
				this.replacement = null;
				this.should_remove = false;

				await leave.call(this.context, node, parent, prop, index);

				if (this.replacement) {
					node = this.replacement;
					this.replace(parent, prop, index, node);
				}

				if (this.should_remove) {
					this.remove(parent, prop, index);
				}

				const removed = this.should_remove;

				this.replacement = _replacement;
				this.should_remove = _should_remove;

				if (removed) return null;
			}
		}

		return node;
	}
}
