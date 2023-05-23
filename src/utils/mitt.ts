import type { Emitter } from "mitt";
import mitt from "mitt";

type Events = {
  resize: {
    detail: {
      width: number;
      height: number;
    };
  };
  openPanel: string;
  tagViewsChange: string;
  tagViewsShowModel: string;
  tabsIconChange: boolean;
  logoChange: boolean;
  breadcrumbIconChange: boolean;
  changLayoutRoute: {
    indexPath: string;
    parentPath: string;
  };
};

export const emitter: Emitter<Events> = mitt<Events>();
