<template>
  <div class="flex items-start space-x-4">
    <div class="flex-shrink-0">
      <img
        src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj"
        class="inline-block w-8 h-8 rounded-full" />
    </div>
    <div>
      <div>{{ }}</div>
      <div>{{ text }}</div>
      <div class="flex items-center">
        <div>
          <SolidHeart v-if="isLikedByMe" class="h-6 w-6 cursor-pointer" @click="() => removeLikeFromPost(id)" />
          <OutlineHeart v-else class="h-6 w-6 cursor-pointer" @click="() => addLikeToPost(id)" />
        </div>
        <div>{{ likeCount }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { HeartIcon as SolidHeart } from '@heroicons/vue/24/solid';
import { HeartIcon as OutlineHeart } from '@heroicons/vue/24/outline';
import { Post as PostProps } from '~/interfaces';

const {
  id,
  text,
  likes,
} = defineProps<PostProps>();

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

const { addLikeToPost, removeLikeFromPost } = usePostsApi();

const isLikedByMe = computed(() => likes.some(l => l.userId === currentUser.value?.id));
</script>