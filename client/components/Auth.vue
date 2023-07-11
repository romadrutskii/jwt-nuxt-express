<script setup lang="ts">
const props = defineProps<{
  isLogin: boolean,
}>();

const username = ref('');
const password = ref('');

const authStore = useAuthStore();
const { login, register } = authStore;

const onSubmit = () => {
  if (props.isLogin) {
    login(username.value, password.value);
  } else {
    register(username.value, password.value);
  }
};
</script>

<template>
  <div class="shadow-md p-8 rounded-md">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      {{ isLogin ? 'Login' : 'Registration' }}
    </h2>
    <div class="divide-y divide-gray-300/50 flex flex-col gap-y-4">
      <div>
        <form class="mt-8 space-y-6" @submit.prevent="onSubmit">
          <input type="text" v-model="username" placeholder="Username" required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
          <input type="password" v-model="password" placeholder="Password" required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
          <div>
            <button type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {{ isLogin ? 'Login' : 'Register' }}
            </button>
          </div>
        </form>
      </div>
      <div class="pt-4">
        <NuxtLink to="/register" v-if="isLogin">
          <button
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-400 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            Create new account
          </button>
        </NuxtLink>
        <NuxtLink to="/login" v-else>
          <button
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-400 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            Log in
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>