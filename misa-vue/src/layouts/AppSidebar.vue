<script setup>
import { ref, computed } from "vue"

const isCollapsed = ref(false)
const activeKey = ref("recruitment")
const navItems = [
  { key: "recruitment", label: "Tin tuyển dụng", icon: "icon-sb-recrument" },
  { key: "candidate", label: "Ứng viên", icon: "icon-candidate" },
  { key: "calendar", label: "Lịch", icon: "icon-calendar" },
  { key: "talent-pool", label: "Kho tiềm năng", icon: "icon-storage" },
  { key: "campaign", label: "Chiến dịch tuyển dụng", icon: "icon-marketing" },
  { key: "job", label: "Công việc", icon: "icon-job" },
  { key: "ai-marketing", label: "aiMarketing", icon: "icon-aimarketing" },
]
const toggleText = computed(() => (isCollapsed.value ? "Mở rộng" : "Thu gọn"))

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <aside
    id="sidebar"
    class="sidebar display-flex flex-direction-column"
    :class="{ collapsed: isCollapsed }"
  >
    <div class="sidebar-image">
      <div class="sidebar-inner">
        <nav class="sidebar-menu display-flex flex-direction-column">
          <a v-for="item in navItems" :key="item.key" class="nav-item"
            :class="{ active: activeKey === item.key }" @click="activeKey = item.key">
            <span class="icon" :class="item.icon"></span>
            <span class="label">{{ item.label }}</span>
          </a>
          <!-- <a class="nav-item">
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
          </a> -->
          <div class="sidebar-footer">
            <button
              class="collapse-btn sidebar-collapse-btn"
              type="button"
              id="collapseBtn"
              :aria-pressed="isCollapsed"
              @click="toggleSidebar"
            >
              <span class="icon icon-shorten collape-main-icon"></span>
              <span class="label-btn collapse-label">{{ toggleText }}</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  </aside>
</template>


