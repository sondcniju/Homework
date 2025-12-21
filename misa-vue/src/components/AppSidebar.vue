<script setup>
import { ref, computed } from "vue"

const isCollapsed = ref(false)
const toggleText = computed(() => (isCollapsed.value ? "Mở rộng" : "Thu gọn"))

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <aside
    id="sidebar"
    class="sidebar display-flex flex-direction-column"
    :class="{ 'sidebar-collapsed': isCollapsed }"
  >
    <div class="sidebar-image">
      <div class="sidebar-inner">
        <nav class="sidebar-menu display-flex flex-direction-column">
          <a class="nav-item">
            <span class="icon icon-sb-recrument"></span>
            <span class="label">Tin tuyển dụng</span>
          </a>
          <a class="nav-item active">
            <span class="icon icon-candidate"></span>
            <span class="label">Ứng viên</span>
          </a>
          <a class="nav-item">
            <span class="icon icon-calendar"></span>
            <span class="label">Lịch</span>
          </a>
          <a class="nav-item">
            <span class="icon icon-storage"></span>
            <span class="label">Kho tiềm năng</span>
          </a>
          <a class="nav-item">
            <span class="icon icon-job"></span>
            <span class="label">Chiến dịch tuyển dụng</span>
          </a>
          <a class="nav-item">
            <span class="icon icon-marketing"></span>
            <span class="label">Công việc</span>
          </a>
          <a class="nav-item">
            <span class="icon icon-aimarketing"></span>
            <span class="label">aiMarketing</span>
          </a>
          <a class="nav-item">
            <span class="icon icon-chat"></span>
            <span class="label">Trao đổi với ứng viên</span>
          </a>
          <a class="nav-item">
            <span class="icon icon-report"></span>
            <span class="label">Báo cáo</span>
          </a>
          <a class="nav-item">
            <span class="icon icon-settings"></span>
            <span class="label">Thiết lập</span>
          </a>
          <a class="nav-item">
            <span class="icon icon-ideas"></span>
            <span class="label">Kiến thức hữu ích</span>
          </a>
          <div class="sidebar-footer">
            <button
              class="collapse-btn sidebar-collapse-btn"
              type="button"
              id="collapseBtn"
              :aria-pressed="isCollapsed"
              @click="toggleSidebar"
            >
              <span class="icon icon-shorten"></span>
              <span class="label-btn collapse-label">{{ toggleText }}</span>
              <span class="collapse-caret">‹</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  </aside>
</template>
