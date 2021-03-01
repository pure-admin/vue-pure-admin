import { BaseNode } from "estree";
import { SyncWalkerClass, SyncWalker } from "./sync";
import { AsyncWalkerClass, AsyncWalker } from "./async";

export function walk(ast: BaseNode, walker: SyncWalker): BaseNode {
	const instance = new SyncWalkerClass(walker);
	return instance.visit(ast, null, walker.enter, walker.leave);
}

export async function asyncWalk(
	ast: BaseNode,
	walker: AsyncWalker
): Promise<BaseNode> {
	const instance = new AsyncWalkerClass(walker);
	return await instance.visit(ast, null, walker.enter, walker.leave);
}
