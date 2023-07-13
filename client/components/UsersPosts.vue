<script lang="ts" setup>
import { Post as PostProps } from '~/interfaces';

const { posts } = defineProps<{
  posts: PostProps[] | null,
}>();
</script>

<template>
  <div class="w-[600px] max-w-full">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Your posts</h2>
    <div v-if="posts && posts.length">
      <Post v-for="post in posts" :key="post.id" v-bind="post" />
    </div>
    <div v-else>
      You have no posts
    </div>
  </div>
</template>
interfaces