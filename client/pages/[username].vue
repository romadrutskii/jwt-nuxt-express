<script lang="ts" setup>
const route = useRoute();
const username = route.params.username as string;
const { getPostsByUsername } = usePostsApi();

const { data: posts } = await getPostsByUsername(username);
</script>

<template>
  <div>
    <div>
      <UsersPosts :posts="posts" />
    </div>
  </div>
</template>
