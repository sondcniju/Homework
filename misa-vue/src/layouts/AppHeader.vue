<script setup>
import { defineProps, defineEmits } from "vue"

const props = defineProps({
  title: {
    type: String,
    default: "Tuyển dụng",
  },
  placeholder: {
    type: String,
    default: "Tìm kiếm tin tuyển dụng, ứng viên, nhân tài...",
  },
})

const emit = defineEmits(["search"])

const handleSearch = (event) => {
  emit("search", event.target.value)
}
</script>

<template>
  <header class="app-header display-flex align-items-center">
    <div class="header-left display-flex align-items-center justify-content-between">
      <div class="header-left-btn display-flex align-items-center ">
        <button class="icon icon-func func-btn" type="button" aria-label="Chức năng"></button>
        <div class="header-icon">
          <div class="icon icon-view"></div>
        </div>
        <div class="header-text display-flex align-items-center">
          <div class="header-name">{{ props.title }}</div>
        </div>
      </div>
      <div class="header-search-bar display-flex align-items-center">
        <div class="icon icon-search"></div>
        <input
          type="text"
          class="search-input"
          :placeholder="props.placeholder"
          @input="handleSearch"
        />
      </div>
    </div>

    <div class="header-spacer"></div>
    <div class="header-right display-flex ">
      <div class="website align-items-center">
        <div class="icon icon-word"></div>
        <span>Website tuyển dụng</span>
      </div>
      <div class="header-icons display-flex align-items-center justify-content-between">
        <span class="icon icon-speaker"></span>
        <span class="icon icon-cart"></span>
        <span class="icon icon-person"></span>
        <span class="icon icon-invite"></span>
        <span class="icon icon-bell"></span>
        <span class="icon icon-question"></span>
        <span class="icon icon-dot"></span>
        <span class="icon icon-ideas"></span>
        <span class="icon icon-ava"></span>
      </div>
    </div>
  </header>
</template>


