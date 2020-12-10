import { ref } from "vue"
import { debounce } from "../utils/debounce";

// @ts-ignore
import { tagEmitter } from "./tag/index.vue";

export const resizeScreen = ():any =>  {
    let spreadWidth = ref(document.body.clientWidth - 210 + "px")
    let shrinkWidth = ref(document.body.clientWidth - 66 + "px")

    window.onload = (): void => {
      const _resize = (window.onresize = (): void => {

        tagEmitter.emit("resizetag", {
          spreadWidth: document.body.clientWidth - 210 + "px",
          shrinkWidth: document.body.clientWidth - 66 + "px"
        });

        spreadWidth.value = document.body.clientWidth - 210 + "px";
        shrinkWidth.value = document.body.clientWidth - 66 + "px";
    });
      debounce(_resize, 200);
    }
 
    return {
      spreadWidth,
      shrinkWidth,
    }  
}