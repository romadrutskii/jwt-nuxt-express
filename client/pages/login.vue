<script lang="ts" setup>
import Auth from '~/components/Auth.vue';

useHead({
  title: 'Login',
});

definePageMeta({
  layout: "vertically-centered",
});
</script>

<template>
  <Auth :is-login="true" />
</template>