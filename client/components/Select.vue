<template>
  <Listbox v-model="selectedOption">
    <ListboxButton>{{ selectedOption }}</ListboxButton>
    <ListboxOptions>
      <ListboxOption v-for="option in options" :value="option">
        {{ option }}
      </ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>

<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';



defineEmits(['update:modelValue']);

const props = defineProps<{
  options: string[],
  label: string,
  modelValue: string,
}>();

const selectedOption = ref(props.label);

const onItemClick = (e) => {
  console.log(e);
};
</script>