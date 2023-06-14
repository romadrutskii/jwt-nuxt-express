<script lang="ts" setup>
import Auth from '~/components/Auth.vue';

useHead({
  title: 'Registration',
});

definePageMeta({
  layout: "vertically-centered",
});
</script>

<template>
  <Auth :is-login="false" />
</template>