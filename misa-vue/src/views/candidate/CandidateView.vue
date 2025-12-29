<script setup>
import { ref, reactive, computed, nextTick, onMounted, watchEffect } from 'vue'
import AppBody from '@/layouts/AppBody.vue'
import CandidatePopup from '@/views/candidate/CandidatePopup.vue'
import Table from '@/components/tableDetail.vue'
import Search from '@/components/searchBar.vue'

const isPopupOpen = ref(false)
const popupMode = ref('create')
const notice = ref({ type: '', message: '' })
let noticeTimer = null

const avatarClasses = ['sky', 'neutral', 'gold', 'blue', 'yellow', 'green', 'grey', 'orange', 'tomato', 'amber']

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '--'
  return String(value)
}

const formatDate = (value) => {
  if (!value) return '--'
  const dateOnly = String(value).split('T')[0]
  return dateOnly || '--'
}

const getInitials = (name) => {
  if (!name) return '--'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '--'
  const first = parts[0][0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

// =====================
// LocalStorage datasource (tạm thời thay API)
// =====================
const STORAGE_KEY = 'candidates_v1'
const candidates = ref([])

const safeJsonParse = (text, fallback) => {
  try {
    return JSON.parse(text)
  } catch {
    return fallback
  }
}

const readCandidatesFromStorage = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  const parsed = safeJsonParse(raw ?? '[]', [])
  return Array.isArray(parsed) ? parsed : []
}

const writeCandidatesToStorage = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items ?? []))
}

// NOTE: mapCandidates giữ lại để seed dữ liệu từ file json (nếu bạn còn dùng)
const mapCandidates = (items = []) =>
  items.map((item, index) => ({
    id: item.CandidateID ?? `${item.CandidateName}-${index}`,
    name: formatValue(item.CandidateName),
    avatar: getInitials(item.CandidateName || ''),
    avatarClass: avatarClasses[index % avatarClasses.length],
    pill: null,
    phone: formatValue(item.Mobile),
    source: formatValue(item.ChannelName),
    email: formatValue(item.Email),
    campaign: formatValue(item.RecruitmentCampaignNames),
    position: formatValue(item.JobPositionName),
    recruitment: formatValue(item.RecruitmentName),
    round: formatValue(item.RecruitmentRoundName),
    rating: item.Overall ?? item.Score ?? 0,
    applyDate: formatDate(item.ApplyDate),
    eduLevel: formatValue(item.EducationDegreeName),
    eduSchool: formatValue(item.EducationPlaceName),
    eduMajor: formatValue(item.EducationMajorName),
    recentWorkplace: formatValue(item.WorkPlaceRecent),
    recruiter: formatValue(item.AttractivePersonnel),
    orgUnit: formatValue(item.OrganizationUnitName),
    profileFit: formatValue(item.CandidateStatusName),
    area: formatValue(item.AreaName),
    presenter: formatValue(item.PresenterName),
    intakeInfo: formatValue(item.ProbationInfoStatus),
    rowClass: '',
  }))

// UI rows (đúng schema đang render ở table) lưu trực tiếp vào LocalStorage.
const normalizeCandidateRow = (row, index = 0) => ({
  id: row?.id ?? `cand_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
  name: formatValue(row?.name),
  avatar: getInitials(row?.name || ''),
  avatarClass: row?.avatarClass ?? avatarClasses[index % avatarClasses.length],
  pill: row?.pill ?? null,
  phone: formatValue(row?.phone),
  source: formatValue(row?.source),
  email: formatValue(row?.email),
  campaign: formatValue(row?.campaign),
  position: formatValue(row?.position),
  recruitment: formatValue(row?.recruitment),
  round: formatValue(row?.round),
  rating: Number(row?.rating ?? 0),
  applyDate: formatValue(row?.applyDate),
  eduLevel: formatValue(row?.eduLevel),
  eduSchool: formatValue(row?.eduSchool),
  eduMajor: formatValue(row?.eduMajor),
  recentWorkplace: formatValue(row?.recentWorkplace),
  recruiter: formatValue(row?.recruiter),
  orgUnit: formatValue(row?.orgUnit),
  profileFit: formatValue(row?.profileFit),
  area: formatValue(row?.area),
  presenter: formatValue(row?.presenter),
  intakeInfo: formatValue(row?.intakeInfo),
  rowClass: row?.rowClass ?? '',
})

const setCandidates = (items) => {
  const normalized = (items ?? []).map((it, idx) => normalizeCandidateRow(it, idx))
  candidates.value = normalized
  writeCandidatesToStorage(normalized)
}

const loadCandidates = async () => {
  // 1) Ưu tiên LocalStorage
  const stored = readCandidatesFromStorage()
  if (stored.length) {
    candidates.value = stored.map((it, idx) => normalizeCandidateRow(it, idx))
    selectedIndex.value = candidates.value.length ? 0 : 0
    return
  }

  // 2) Nếu chưa có LocalStorage, có thể seed từ file json cũ (tuỳ bạn)
  //    Nếu bạn không dùng seed nữa, có thể xoá đoạn fetch này.
  try {
    const response = await fetch('/data/candidate.json', { cache: 'no-store' })
    if (!response.ok) throw new Error(`Failed to load candidate data: ${response.status}`)
    const data = await response.json()
    const rawCandidates = data?.Data?.PageData ?? []
    const seeded = mapCandidates(rawCandidates)
    setCandidates(seeded)
    selectedIndex.value = seeded.length ? 0 : 0
  } catch (error) {
    console.error(error)
    setCandidates([])
  }
}

const candidateCount = computed(() => candidates.value.length)
const pageSizeOptions = [15, 25, 50, 100]
const pageSize = ref(25)
const currentPage = ref(1)
const pagedCandidates = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return candidates.value.slice(start, start + pageSize.value)
})
const totalPages = computed(() => Math.max(1, Math.ceil(candidates.value.length / pageSize.value)))
const pageRange = computed(() => {
  if (!candidates.value.length) return { start: 0, end: 0 }
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, candidates.value.length)
  return { start, end }
})
const selectedIndex = ref(0)
const selectedIds = ref(new Set())
const searchText = ref('')
const candidateSearchKeys = [
  'name',
  'phone',
  'email',
  'source',
  'campaign',
  'position',
  'recruitment',
  'round',
  'eduLevel',
  'eduSchool',
  'eduMajor',
  'recentWorkplace',
  'recruiter',
  'orgUnit',
  'profileFit',
  'area',
  'presenter',
  'intakeInfo',
]

const toggleSelectAll = (event) => {
  const shouldSelect = event.target.checked
  const next = new Set(selectedIds.value)
  if (shouldSelect) {
    pagedCandidates.value.forEach((candidate) => next.add(candidate.id))
  } else {
    pagedCandidates.value.forEach((candidate) => next.delete(candidate.id))
  }
  selectedIds.value = next
}

const toggleRowSelection = (candidateId, event) => {
  const next = new Set(selectedIds.value)
  if (event.target.checked) {
    next.add(candidateId)
  } else {
    next.delete(candidateId)
  }
  selectedIds.value = next
}

const isMuted = (value) => value === '--'

const candidateColumns = [
  {
    key: 'checkbox',
    type: 'selection',
    headerClass: 'checkbox-box',
    class: 'col-checkbox',
    resizable: false,
  },
  { key: 'phone', label: 'Số điện thoại', class: 'col-phone', getCellClass: (row) => ({ muted: isMuted(row.phone) }) },
  { key: 'source', label: 'Nguồn ứng viên', class: 'col-source', getCellClass: (row) => ({ muted: isMuted(row.source) }) },
  { key: 'name', label: 'Họ và tên', class: 'col-name' },
  { key: 'email', label: 'Email', class: 'col-email', getCellClass: (row) => ({ muted: isMuted(row.email) }) },
  { key: 'campaign', label: 'Chiến dịch tuyển dụng', class: 'col-campaign', getCellClass: (row) => ({ muted: isMuted(row.campaign) }) },
  { key: 'position', label: 'Vị trí tuyển dụng', class: 'col-position', getCellClass: (row) => ({ muted: isMuted(row.position) }) },
  { key: 'recruitment', label: 'Tin tuyển dụng', class: 'col-recruitment', getCellClass: (row) => ({ muted: isMuted(row.recruitment) }) },
  { key: 'round', label: 'Vòng tuyển dụng', class: 'col-round', getCellClass: (row) => ({ muted: isMuted(row.round) }) },
  {
    key: 'rating',
    label: 'Đánh giá',
    class: 'col-rating rating',
    getCellAttrs: (row) => ({ 'data-score': row.rating }),
  },
  { key: 'applyDate', label: 'Ngày ứng tuyển', class: 'col-apply-date', getCellClass: (row) => ({ muted: isMuted(row.applyDate) }) },
  { key: 'eduLevel', label: 'Trình độ đào tạo', class: 'col-edu-level', getCellClass: (row) => ({ muted: isMuted(row.eduLevel) }) },
  { key: 'eduSchool', label: 'Nơi đào tạo', class: 'col-edu-school', getCellClass: (row) => ({ muted: isMuted(row.eduSchool) }) },
  { key: 'eduMajor', label: 'Chuyên ngành', class: 'col-edu-major', getCellClass: (row) => ({ muted: isMuted(row.eduMajor) }) },
  { key: 'recentWorkplace', label: 'Nơi làm việc trước đây', class: 'col-recent-workplace', getCellClass: (row) => ({ muted: isMuted(row.recentWorkplace) }) },
  { key: 'recruiter', label: 'Nhân sự khai thác', class: 'col-recruiter', getCellClass: (row) => ({ muted: isMuted(row.recruiter) }) },
  { key: 'orgUnit', label: 'Đơn vị sử dụng', class: 'col-org-unit', getCellClass: (row) => ({ muted: isMuted(row.orgUnit) }) },
  { key: 'profileFit', label: 'Phù hợp với chân dung', class: 'col-profile-fit', getCellClass: (row) => ({ muted: isMuted(row.profileFit) }) },
  { key: 'area', label: 'Khu vực', class: 'col-area', getCellClass: (row) => ({ muted: isMuted(row.area) }) },
  { key: 'presenter', label: 'Người giới thiệu', class: 'col-presenter', getCellClass: (row) => ({ muted: isMuted(row.presenter) }) },
  { key: 'intakeInfo', label: 'Thông tin tiếp nhận', class: 'col-intake', getCellClass: (row) => ({ muted: isMuted(row.intakeInfo) }) },
  { key: 'actions', label: 'Thao tác', class: 'has-edit col-actions', resizable: false },
]

const popupTitle = computed(() => (popupMode.value === 'edit' ? 'Chỉnh sửa thông tin ứng viên' : 'Thêm ứng viên'))

// Lưu id đang edit để submit update đúng record
const editingId = ref(null)

const createEmptyFormData = () => ({
  name: '',
  dob: '',
  gender: '',
  area: '',
  phone: '',
  email: '',
  address: '',
  eduLevel: '',
  eduSchool: '',
  eduMajor: '',
  applyDate: '',
  source: '',
  recruiter: '',
  collaborator: '',
  addReferee: false,
  recentWorkplace: '',
  workCompany: '',
  workStart: '',
  workEnd: '',
  workPosition: '',
  workDescription: '',
})

const formData = reactive(createEmptyFormData())

const resetFormData = () => {
  Object.assign(formData, createEmptyFormData())
}

const normalizeFormValue = (value) => (isMuted(value) ? '' : value)

const collectCandidateData = () => ({ ...formData })

const openPopup = () => {
  popupMode.value = 'create'
  editingId.value = null
  resetFormData()
  isPopupOpen.value = true
}

const openEditPopup = async (index = selectedIndex.value) => {
  selectedIndex.value = index
  const candidate = pagedCandidates.value[index]
  if (!candidate) return
  popupMode.value = 'edit'
  editingId.value = candidate.id
  isPopupOpen.value = true
  await nextTick()
  resetFormData()
  Object.assign(formData, {
    name: normalizeFormValue(candidate.name),
    phone: normalizeFormValue(candidate.phone),
    email: normalizeFormValue(candidate.email),
    applyDate: normalizeFormValue(candidate.applyDate),
    area: normalizeFormValue(candidate.area),
    source: normalizeFormValue(candidate.source),
    recruiter: normalizeFormValue(candidate.recruiter),
    recentWorkplace: normalizeFormValue(candidate.recentWorkplace),
    eduLevel: normalizeFormValue(candidate.eduLevel),
    eduSchool: normalizeFormValue(candidate.eduSchool),
    eduMajor: normalizeFormValue(candidate.eduMajor),
    workPosition: normalizeFormValue(candidate.position),
  })
}

const selectCandidate = (index) => {
  selectedIndex.value = index
}

const closePopup = () => {
  isPopupOpen.value = false
  // không xoá formData ở đây để user đóng mở lại vẫn còn (tuỳ bạn). Nếu muốn reset thì mở comment.
  // resetFormData()
}

const buildRowFromForm = (payload, baseRow) => {
  const row = {
    ...(baseRow ?? {}),
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    applyDate: payload.applyDate,
    area: payload.area,
    source: payload.source,
    recruiter: payload.recruiter,
    recentWorkplace: payload.recentWorkplace,
    eduLevel: payload.eduLevel,
    eduSchool: payload.eduSchool,
    eduMajor: payload.eduMajor,
    position: payload.workPosition,
  }
  return normalizeCandidateRow(row, 0)
}

const handleSubmit = (event) => {
  event?.preventDefault?.()
  const payload = collectCandidateData()

  // VALIDATE
  if (!payload.name?.trim()) {
    notice.value = { type: 'error', message: 'Lưu không thành công. Vui lòng nhập họ và tên.' }
    clearTimeout(noticeTimer)
    noticeTimer = setTimeout(() => {
      notice.value = { type: '', message: '' }
    }, 2500)
    return
  }

  // SAVE -> LocalStorage
  const current = [...candidates.value]

  if (popupMode.value === 'edit' && editingId.value) {
    const idx = current.findIndex((c) => c.id === editingId.value)
    if (idx !== -1) {
      const updated = buildRowFromForm(payload, current[idx])
      // giữ lại avatarClass cũ để không bị đổi màu mỗi lần sửa
      updated.avatarClass = current[idx].avatarClass
      updated.id = current[idx].id
      current[idx] = normalizeCandidateRow(updated, idx)
    }
  } else {
    const created = buildRowFromForm(payload)
    created.id = (globalThis.crypto?.randomUUID?.() ?? created.id)
    // set avatarClass theo thứ tự hiện tại
    current.unshift(normalizeCandidateRow(created, 0))
  }

  setCandidates(current)
  currentPage.value = 1
  selectedIndex.value = 0

  notice.value = { type: 'success', message: 'Lưu thành công.' }
  clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => {
    notice.value = { type: '', message: '' }
  }, 2500)
  isPopupOpen.value = false
}

onMounted(() => {
  loadCandidates()
})

watchEffect(() => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

const handleRowClick = ({ index }) => {
  selectCandidate(index)
}

const handleRowSelection = ({ id, event }) => {
  toggleRowSelection(id, event)
}
</script>

<template>
  <div v-if="notice.message" class="toast" :class="notice.type">{{ notice.message }}</div>
  <AppBody>
    <div class="page-bar display-flex justify-content-between align-items-center">
      <div class="page-title">Ứng viên</div>
      <div class="page-actions display-flex">
        <button class="primary-btn" type="button" @click="openPopup">+ Thêm ứng viên</button>
      </div>
    </div>

    <section class="card candidate-list-card">
      <div class="table-toolbar display-flex justify-content-between align-items-center">
        <div class="toolbar-left display-flex align-items-center">
          <div class="text-container">
            <Search v-model="searchText" placeholder="Tim kiem nhanh trong danh sach" />
          </div>
        </div>
        <div class="toolbar-right display-flex align-items-center">
          <button class="icon-btn ghost" type="button" aria-label="Lọc">?</button>
          <button class="icon-btn ghost" type="button" aria-label="Sắp xếp">?</button>
          <button class="icon-btn ghost" type="button" aria-label="Làm mới">?</button>
          <button class="icon-btn ghost" type="button" aria-label="Ẩn cột">?</button>
        </div>
      </div>

      <div class="candidate-table-wrapper">
        <Table
          table-class="candidate-table"
          :columns="candidateColumns"
          :rows="pagedCandidates"
          :selected-ids="selectedIds"
          :active-index="selectedIndex"
          :enable-search="true"
          :show-search="false"
          :search-keys="candidateSearchKeys"
          v-model:searchValue="searchText"
          @toggle-select-all="toggleSelectAll"
          @toggle-row-selection="handleRowSelection"
          @row-click="handleRowClick"
        >
          <template #cell-name="{ row }">
            <div class="cell-person">
              <div class="avatar" :class="row.avatarClass">{{ row.avatar }}</div>
              <div class="person-meta" :data-fullname="row.name">
                <div class="name">{{ row.name }}</div>
                <span v-if="row.pill" class="pill" :class="row.pill.type">
                  {{ row.pill.text }}
                </span>
              </div>
            </div>
          </template>
          <template #cell-rating></template>
          <template #cell-actions="{ index }">
            <button
              class="row-edit-btn"
              type="button"
              aria-label="Chinh sua thong tin ung vien"
              @click.stop="openEditPopup(index)"
            >
              &#9998;
            </button>
          </template>
        </Table>
      </div>

      <div class="table-footer display-flex justify-content-between align-items-center">
        <div class="total-records" :data-total-count="candidateCount">Tong: {{ candidateCount }} ban ghi</div>
        <div class="pagination display-flex align-items-center">
          <span>Số bản ghi/trang</span>
          <select class="pill" v-model.number="pageSize" @change="currentPage = 1">
            <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
          </select>
          <span>{{ pageRange.start }} - {{ pageRange.end }} bản ghi</span>
          <div class="pagination-controls">
            <button aria-label="Trang truoc" type="button">&lt;</button>
            <button aria-label="Trang sau" type="button">&gt;</button>
          </div>
        </div>
      </div>
    </section>
  </AppBody>

  <CandidatePopup
    :is-open="isPopupOpen"
    :title="popupTitle"
    :form-data="formData"
    @close="closePopup"
    @submit="handleSubmit"
  />
</template>

<style scoped>
:deep(.row-selected) {
  outline: 1px solid #e5e7eb;
  outline-offset: -1px;
}

.toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  padding: 10px 14px;
  border-radius: 6px;
  font-weight: 600;
  color: #fff;
  z-index: 4000;
}

.toast.success {
  background: #2f80ed;
}

.toast.error {
  background: #e53935;
}

:deep(.has-edit) {
  width: 72px;
  text-align: right;
}

:deep(.row-edit-btn) {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.15s ease;
}

:deep(.candidate-table tbody tr:hover .row-edit-btn) {
  opacity: 1;
}
</style>
