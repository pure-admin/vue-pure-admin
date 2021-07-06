import type { Emitter } from "mitt";
import mitt from "mitt";

export const emitter: Emitter = mitt();
