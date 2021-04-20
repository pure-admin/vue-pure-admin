<template>
  <div>
    <div ref="editor"></div>
    <div :innerHTML="content.html"></div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref, reactive } from 'vue'
import WangEditor from 'wangeditor'

export default {
  name: 'editor',
  setup() {
    const editor = ref()
    const content = reactive({
      html: '',
      text: '',
    })

    let instance
    onMounted(() => {
      instance = new WangEditor(editor.value)
      Object.assign(instance.config, {
        onchange() {
          content.html = instance.txt.html()
        },
      })
      instance.create()
    })

    onBeforeUnmount(() => {
      instance.destroy()
      instance = null
    })

    return {
      editor,
      content,
    }
  },
};
</script>

<style lang="scss" scoped>
:deep(.w-e-text-container) {
  z-index: 99 !important;
}
:deep(.w-e-toolbar) {
  z-index: 999 !important;
  position: static;
}
</style>