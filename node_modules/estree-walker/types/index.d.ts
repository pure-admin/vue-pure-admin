import { BaseNode } from "estree";
import { SyncWalker } from "./sync";
import { AsyncWalker } from "./async";
export declare function walk(ast: BaseNode, walker: SyncWalker): BaseNode;
export declare function asyncWalk(ast: BaseNode, walker: AsyncWalker): Promise<BaseNode>;
