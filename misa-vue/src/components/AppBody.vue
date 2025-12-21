<script setup>
import AppHeader from "./AppHeader.vue"
import AppSidebar from "./AppSidebar.vue"
</script>

<template>
  <div class="app display-flex flex-direction-column">
    <AppHeader />
    <div class="app-body display-flex">
      <AppSidebar />
      <main class="main-content display-flex flex-direction-column">
        <slot />
      </main>
    </div>
  </div>
</template>
