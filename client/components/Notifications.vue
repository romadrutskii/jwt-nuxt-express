<template>
  <div class="notification-container">
    <transition-group name="slide" tag="div">
      <Toast v-for="notification in notifications" :key="notification.id" v-bind="notification" />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import Toast from '~/components/Toast.vue';

const { notifications } = useNotifications();
</script>

<style scoped>
.notification-container {
  transform: translate(-50%, 0);
  max-width: 700px;
  position: fixed;
  bottom: 0;
  left: 50%;
  padding: 1rem;
  display: flex;
  flex-direction: column-reverse;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>