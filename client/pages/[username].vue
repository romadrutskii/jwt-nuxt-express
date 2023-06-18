<script lang="ts" setup>
const route = useRoute();
const username = route.params.username;

const { data, error } = await usePostsFetch(`posts/${username}`, {
  method: 'GET',
  server: true,
});
</script>

<template>
  <div>
    <div>
      <UsersPosts :posts="data" />
    </div>
  </div>
</template>
