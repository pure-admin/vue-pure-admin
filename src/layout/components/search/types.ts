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

interface Props {
  value: string;
  options: Array<optionsItem>;
}

export type { optionsItem, dragItem, Props };
