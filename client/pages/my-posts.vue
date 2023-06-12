<script lang="ts" setup>
import useAuthStore from '~/stores/auth';
import { ref, onMounted } from 'vue';

const { notify } = useNotifications();
const cookie = useCookie('accessToken');

const loading = ref(false);
const posts = ref([]);
const authStore = useAuthStore();
const { logout } = authStore;

const refresh = () => { };

const { data, pending, error } = await usePostsFetch('posts', {
  method: 'GET',
});

if (error.value) {
  console.log(error.value);
  notify({
    type: 'error',
    message: error.value.data.error,
  });
  cookie.value = '';
  // await navigateTo('/login');
} else {
  posts.value = data.value;
}
// };
// await fetchPosts();



/* 
const refresh = () => {
  this.$authApi
    .post('/refresh-token')
    .then((response) => {
      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      alert('Refresh successful!');
    })
    .catch((error) => {
      console.error(error);
      alert('Refresh failed!');
    });
};*/


</script>

<template>
  <div v-if="loading || pending">
    Loading...
  </div>
  <div v-else>
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Your posts</h2>
    <div>
      <div v-for="post in posts" :key="post.id">
        <h3>{{ post.title }}</h3>
        <p>{{ post.text }}</p>
      </div>
    </div>
    <div class="text-center mt-4 flex gap-3 font-bold font-mono justify-center">
      <button @click="refresh" class="py-2 px-4 flex gap-4 text-white text-sm leading-6 bg-sky-600 rounded-md shadow-sm">
        Refresh token
      </button>
      <button @click="logout"
        class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
        Logout
      </button>
    </div>
  </div>
</template>

