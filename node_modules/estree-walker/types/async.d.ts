import { WalkerBase, WalkerContext } from "./walker";
import { BaseNode } from "estree";
export declare type AsyncWalker = {
    enter?: AsyncWalkerHandler;
    leave?: AsyncWalkerHandler;
};
export declare type AsyncWalkerHandler = (this: WalkerContext, node: BaseNode, parent: BaseNode, key: string, index: number) => Promise<void>;
export declare class AsyncWalkerClass extends WalkerBase {
    protected enter: AsyncWalker["enter"];
    protected leave: AsyncWalker["leave"];
    constructor(walker: AsyncWalker);
    visit(node: BaseNode, parent: BaseNode, enter: AsyncWalkerHandler, leave: AsyncWalkerHandler, prop?: string, index?: number): Promise<BaseNode>;
}
