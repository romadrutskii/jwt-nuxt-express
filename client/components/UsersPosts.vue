<script lang="ts" setup>
const postsStore = usePostsStore();
await postsStore.getPosts();

const { posts } = storeToRefs(postsStore);
</script>

<template>
  <div>
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Your posts</h2>
    <div v-if="posts && posts.length">
      <div v-for="post in posts" :key="post.id">
        <h3>{{ post.title }}</h3>
        <p>{{ post.text }}</p>
      </div>
    </div>
    <div v-else-if="posts && !posts.length">
      You have no posts
    </div>
  </div>
</template>

