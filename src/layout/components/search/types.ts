interface optionsItem {
  path: string;
  type?: "history" | "collect";
  meta?: {
    icon?: string;
    title?: string;
  };
}

export type { optionsItem };
