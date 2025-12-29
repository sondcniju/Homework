<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Tim kiem',
  },
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="table-search">
    <span class="icon icon-search small"></span>
    <input class="table-search-input" type="text" :placeholder="placeholder" :value="modelValue"
      @input="handleInput" />
  </div>
</template>
