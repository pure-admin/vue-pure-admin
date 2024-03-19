import type dagre from "dagre";
import type { Node } from "@vue-flow/core";
import { useVueFlow } from "@vue-flow/core";
import { type MaybeRefOrGetter, toRef, toValue, ref } from "vue";

export function useRunProcess(
  dagreGraph: MaybeRefOrGetter<dagre.graphlib.Graph>
) {
  const { updateNodeData } = useVueFlow();

  const graph = toRef(() => toValue(dagreGraph));

  const isRunning = ref(false);
  const executedNodes = new Set<string>();
  const runningTasks = new Map<string, NodeJS.Timeout>();

  async function runNode(node: { id: string }, isStart = false) {
    if (executedNodes.has(node.id)) {
      return;
    }

    executedNodes.add(node.id);

    updateNodeData(node.id, {
      isRunning: true,
      isFinished: false,
      hasError: false,
      isCancelled: false
    });

    const delay = Math.floor(Math.random() * 2000) + 1000;
    return new Promise<void>(resolve => {
      const timeout = setTimeout(
        async () => {
          const children = graph.value.successors(
            node.id
          ) as unknown as string[];

          const willThrowError = Math.random() < 0.15;

          if (willThrowError) {
            updateNodeData(node.id, { isRunning: false, hasError: true });

            await skipDescendants(node.id);
            runningTasks.delete(node.id);

            resolve();
            return;
          }

          updateNodeData(node.id, { isRunning: false, isFinished: true });
          runningTasks.delete(node.id);

          if (children.length > 0) {
            await Promise.all(children.map(id => runNode({ id })));
          }

          resolve();
        },
        isStart ? 0 : delay
      );

      runningTasks.set(node.id, timeout);
    });
  }

  async function run(nodes: Node[]) {
    if (isRunning.value) {
      return;
    }

    reset(nodes);

    isRunning.value = true;

    const startingNodes = nodes.filter(
      node => graph.value.predecessors(node.id)?.length === 0
    );

    await Promise.all(startingNodes.map(node => runNode(node, true)));

    clear();
  }

  function reset(nodes: Node[]) {
    clear();

    for (const node of nodes) {
      updateNodeData(node.id, {
        isRunning: false,
        isFinished: false,
        hasError: false,
        isSkipped: false,
        isCancelled: false
      });
    }
  }

  async function skipDescendants(nodeId: string) {
    const children = graph.value.successors(nodeId) as unknown as string[];

    for (const child of children) {
      updateNodeData(child, { isRunning: false, isSkipped: true });
      await skipDescendants(child);
    }
  }

  function stop() {
    isRunning.value = false;

    for (const [nodeId, task] of runningTasks) {
      clearTimeout(task);
      runningTasks.delete(nodeId);
      updateNodeData(nodeId, {
        isRunning: false,
        isFinished: false,
        hasError: false,
        isSkipped: false,
        isCancelled: true
      });
      skipDescendants(nodeId);
    }

    executedNodes.clear();
  }

  function clear() {
    isRunning.value = false;
    executedNodes.clear();
    runningTasks.clear();
  }

  return { run, stop, reset, isRunning };
}
