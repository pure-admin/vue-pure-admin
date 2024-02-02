interface optionsItem {
  path: string;
  type: "history" | "collect";
  meta: {
    icon?: string;
    title?: string;
  };
}

interface dragItem {
  oldIndex: number;
  newIndex: number;
}

export type { optionsItem, dragItem };
