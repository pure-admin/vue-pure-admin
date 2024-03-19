<script lang="ts" setup>
defineProps({
  name: {
    type: String,
    required: true
  }
});
</script>

<template>
  <svg
    v-if="name === 'play'"
    viewBox="0 0 24 24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </svg>

  <svg
    v-else-if="name === 'stop'"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height="24"
  >
    <path
      fill="currentColor"
      d="M8 16h8V8H8zm4 6q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22"
    />
  </svg>

  <svg
    v-else-if="name === 'horizontal'"
    viewBox="0 0 24 24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2,12 L22,12" stroke="currentColor" stroke-width="2" />
    <path
      d="M7,7 L2,12 L7,17"
      stroke="currentColor"
      stroke-width="2"
      fill="none"
    />
    <path
      d="M17,7 L22,12 L17,17"
      stroke="currentColor"
      stroke-width="2"
      fill="none"
    />
  </svg>

  <svg
    v-else-if="name === 'vertical'"
    viewBox="0 0 24 24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12,2 L12,22" stroke="currentColor" stroke-width="2" />
    <path
      d="M7,7 L12,2 L17,7"
      stroke="currentColor"
      stroke-width="2"
      fill="none"
    />
    <path
      d="M7,17 L12,22 L17,17"
      stroke="currentColor"
      stroke-width="2"
      fill="none"
    />
  </svg>

  <svg
    v-else-if="name === 'shuffle'"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height="24"
  >
    <path
      fill="currentColor"
      d="M14 20v-2h2.6l-3.175-3.175L14.85 13.4L18 16.55V14h2v6zm-8.6 0L4 18.6L16.6 6H14V4h6v6h-2V7.4zm3.775-9.425L4 5.4L5.4 4l5.175 5.175z"
    />
  </svg>
</template>
