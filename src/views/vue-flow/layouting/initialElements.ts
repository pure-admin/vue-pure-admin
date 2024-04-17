import type { Edge, Node } from "@vue-flow/core";

const position = { x: 0, y: 0 };
const nodeType = "process";
const edgeType = "animation";

export const initialNodes: Node[] = [
  {
    id: "1",
    position,
    type: nodeType
  },
  {
    id: "2",
    position,
    type: nodeType
  },
  {
    id: "2a",
    position,
    type: nodeType
  },
  {
    id: "2b",
    position,
    type: nodeType
  },
  {
    id: "2c",
    position,
    type: nodeType
  },
  {
    id: "2d",
    position,
    type: nodeType
  },
  {
    id: "3",
    position,
    type: nodeType
  },
  {
    id: "4",
    position,
    type: nodeType
  },
  {
    id: "5",
    position,
    type: nodeType
  },
  {
    id: "6",
    position,
    type: nodeType
  },
  {
    id: "7",
    position,
    type: nodeType
  }
];

export const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", type: edgeType, animated: true },
  { id: "e1-3", source: "1", target: "3", type: edgeType, animated: true },
  { id: "e2-2a", source: "2", target: "2a", type: edgeType, animated: true },
  { id: "e2-2b", source: "2", target: "2b", type: edgeType, animated: true },
  { id: "e2-2c", source: "2", target: "2c", type: edgeType, animated: true },
  { id: "e2c-2d", source: "2c", target: "2d", type: edgeType, animated: true },
  { id: "e3-7", source: "3", target: "4", type: edgeType, animated: true },
  { id: "e4-5", source: "4", target: "5", type: edgeType, animated: true },
  { id: "e5-6", source: "5", target: "6", type: edgeType, animated: true },
  { id: "e5-7", source: "5", target: "7", type: edgeType, animated: true }
];
