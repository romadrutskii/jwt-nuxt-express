<template>
  <Header />
  <div class="container max-w-screen-lg mx-auto px-5 h-screen">
    <slot />
  </div>
  <Notifications />
</template>

<script setup lang="ts">
import Notifications from '~/components/Notifications.client.vue';

</script>