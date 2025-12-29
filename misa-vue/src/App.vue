<template>
  <div class="app display-flex flex-direction-column">
    <AppHeader />
    <div class="app-body display-flex">
      <AppSidebar /> 
        <RouterView />  
    </div>
  </div>
</template>

<script setup>
import AppHeader from "./layouts/AppHeader.vue";
import AppSidebar from "./layouts/AppSidebar.vue";
</script>
