import type { Edge, Node } from "@vue-flow/core";

const position = { x: 0, y: 0 };
const type: string = "process";

export const initialNodes: Node[] = [
  {
    id: "1",
    position,
    type
  },
  {
    id: "2",
    position,
    type
  },
  {
    id: "2a",
    position,
    type
  },
  {
    id: "2b",
    position,
    type
  },
  {
    id: "2c",
    position,
    type
  },
  {
    id: "2d",
    position,
    type
  },
  {
    id: "3",
    position,
    type
  },
  {
    id: "4",
    position,
    type
  },
  {
    id: "5",
    position,
    type
  },
  {
    id: "6",
    position,
    type
  },
  {
    id: "7",
    position,
    type
  }
];

export const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", type: "animation", animated: true },
  { id: "e1-3", source: "1", target: "3", type: "animation", animated: true },
  { id: "e2-2a", source: "2", target: "2a", type: "animation", animated: true },
  { id: "e2-2b", source: "2", target: "2b", type: "animation", animated: true },
  { id: "e2-2c", source: "2", target: "2c", type: "animation", animated: true },
  {
    id: "e2c-2d",
    source: "2c",
    target: "2d",
    type: "animation",
    animated: true
  },
  { id: "e3-7", source: "3", target: "4", type: "animation", animated: true },
  { id: "e4-5", source: "4", target: "5", type: "animation", animated: true },
  { id: "e5-6", source: "5", target: "6", type: "animation", animated: true },
  { id: "e5-7", source: "5", target: "7", type: "animation", animated: true }
];
