<script lang="ts" setup>
const route = useRoute();
const username = ref(route.params.username as string);
const { getPostsByUsername } = usePostsApi();

const { data: posts, refresh } = await getPostsByUsername(username.value);

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);
</script>

<template>
  <div class="flex justify-center">
    <div class="w-[600px] max-w-full">
      <AddPost v-if="currentUser?.username === username" @refresh="refresh" />
      <UsersPosts :posts="posts" />
    </div>
  </div>
</template>
