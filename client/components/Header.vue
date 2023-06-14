<template>
  <div class="sticky backdrop-blur flex items-center justify-end h-10">
    <div>
      Hello, {{ isLoggedIn ? currentUser?.username : 'guest' }}
    </div>
    <button v-if="isLoggedIn" @click="logout"
      class="ml-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { currentUser, isLoggedIn } = storeToRefs(authStore);
const { logout } = authStore;
</script>
