import { WalkerBase, WalkerContext } from "./walker";
import { BaseNode } from "estree";
export declare type SyncWalker = {
    enter?: WalkerHandler;
    leave?: WalkerHandler;
};
export declare type WalkerHandler = (this: WalkerContext, node: BaseNode, parent: BaseNode, key: string, index: number) => void;
export declare class SyncWalkerClass extends WalkerBase {
    protected enter: SyncWalker["enter"];
    protected leave: SyncWalker["leave"];
    constructor(walker: SyncWalker);
    visit(node: BaseNode, parent: BaseNode, enter: WalkerHandler, leave: WalkerHandler, prop?: string, index?: number): BaseNode;
}
