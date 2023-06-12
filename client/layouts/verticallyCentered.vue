<template>
  <DefaultLayout>
    <div class="flex items-center justify-center h-full -translate-y-20">
      <slot />
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from './default.vue';

</script>