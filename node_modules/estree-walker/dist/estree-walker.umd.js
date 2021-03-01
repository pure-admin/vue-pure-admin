(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.estreeWalker = {})));
}(this, (function (exports) { 'use strict';

	class WalkerBase {constructor() { WalkerBase.prototype.__init.call(this);WalkerBase.prototype.__init2.call(this);WalkerBase.prototype.__init3.call(this);WalkerBase.prototype.__init4.call(this); }
		 __init() {this.should_skip = false;}
		 __init2() {this.should_remove = false;}
		 __init3() {this.replacement = null;}

		 __init4() {this.context = {
			skip: () => (this.should_skip = true),
			remove: () => (this.should_remove = true),
			replace: (node) => (this.replacement = node)
		};}

		 replace(parent, prop, index, node) {
			if (parent) {
				if (index !== null) {
					parent[prop][index] = node;
				} else {
					parent[prop] = node;
				}
			}
		}

		 remove(parent, prop, index) {
			if (parent) {
				if (index !== null) {
					parent[prop].splice(index, 1);
				} else {
					delete parent[prop];
				}
			}
		}
	}

	class SyncWalkerClass extends WalkerBase {
		
		

		constructor(walker) {
			super();
			this.enter = walker.enter;
			this.leave = walker.leave;
		}

		 visit(
			node,
			parent,
			enter,
			leave,
			prop,
			index
		) {
			if (node) {
				if (enter) {
					const _should_skip = this.should_skip;
					const _should_remove = this.should_remove;
					const _replacement = this.replacement;
					this.should_skip = false;
					this.should_remove = false;
					this.replacement = null;

					enter.call(this.context, node, parent, prop, index);

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
					const value = (node )[key];

					if (typeof value !== "object") {
						continue;
					} else if (Array.isArray(value)) {
						for (let i = 0; i < value.length; i += 1) {
							if (value[i] !== null && typeof value[i].type === 'string') {
								if (!this.visit(value[i], node, enter, leave, key, i)) {
									// removed
									i--;
								}
							}
						}
					} else if (value !== null && typeof value.type === "string") {
						this.visit(value, node, enter, leave, key, null);
					}
				}

				if (leave) {
					const _replacement = this.replacement;
					const _should_remove = this.should_remove;
					this.replacement = null;
					this.should_remove = false;

					leave.call(this.context, node, parent, prop, index);

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

	class AsyncWalkerClass extends WalkerBase {
		
		

		constructor(walker) {
			super();
			this.enter = walker.enter;
			this.leave = walker.leave;
		}

		 async visit(
			node,
			parent,
			enter,
			leave,
			prop,
			index
		) {
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
					const value = (node )[key];

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

	function walk(ast, walker) {
		const instance = new SyncWalkerClass(walker);
		return instance.visit(ast, null, walker.enter, walker.leave);
	}

	async function asyncWalk(
		ast,
		walker
	) {
		const instance = new AsyncWalkerClass(walker);
		return await instance.visit(ast, null, walker.enter, walker.leave);
	}

	exports.walk = walk;
	exports.asyncWalk = asyncWalk;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
