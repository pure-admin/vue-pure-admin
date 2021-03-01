import { BaseNode } from "estree";
export declare type WalkerContext = {
    skip: () => void;
    remove: () => void;
    replace: (node: BaseNode) => void;
};
export declare class WalkerBase {
    protected should_skip: boolean;
    protected should_remove: boolean;
    protected replacement: BaseNode;
    context: WalkerContext;
    replace(parent: any, prop: string, index: number, node: BaseNode): void;
    remove(parent: any, prop: string, index: number): void;
}
