<script lang="ts" setup>
import Auth from '~/components/Auth.vue';

definePageMeta({
  layout: "vertically-centered",
  title: 'Login',
});
</script>

<template>
  <Auth :is-login="false" />
</template>