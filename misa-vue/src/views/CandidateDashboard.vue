<script setup>
import { ref, computed, nextTick } from 'vue'
import AppBody from '@/components/AppBody.vue'

const isPopupOpen = ref(false)
const popupMode = ref('create')
const candidateFormRef = ref(null)
const notice = ref({ type: '', message: '' })
let noticeTimer = null

const candidates = ref([
  {
    name: 'Lê Mạnh Hùng',
    avatar: 'LH',
    avatarClass: 'sky',
    pill: null,
    phone: '--',
    email: '--',
    campaign: '--',
    position: '--',
    recruitment: '--',
    round: '--',
    rating: 0,
    applyDate: '24/10/2025',
    rowClass: 'row-warn',
  },
  {
    name: 'Nguyễn Minh Phong',
    avatar: 'NP',
    avatarClass: 'neutral',
    pill: { text: 'Nhân viên', type: 'success' },
    phone: '--',
    email: 'dtthao.test02@gmail.com',
    campaign: '--',
    position: 'QC /Tester/Kiểm thử phần mềm...',
    recruitment: 'QC/Tester HN, HC...',
    round: 'Đã tuyển',
    rating: 3,
    applyDate: '18/07/2025',
    rowClass: 'row-warn',
  },
  {
    name: 'Tạ Long Khánh',
    avatar: 'TK',
    avatarClass: 'gold',
    pill: { text: 'Đề xuất nhận việc', type: 'success' },
    phone: '--',
    email: 'trangthu.tester@gmail.com',
    campaign: '--',
    position: 'QC /Tester/Kiểm thử phần mềm...',
    recruitment: 'QC/Tester HN, HC...',
    round: 'Offer',
    rating: 4,
    applyDate: '19/08/2025',
    rowClass: 'row-safe',
  },
  {
    name: 'Lợi Cẩm Linh',
    avatar: 'LL',
    avatarClass: 'blue',
    pill: null,
    phone: '0982 970 918',
    email: 'camlhinh.lai27@gmail.com',
    campaign: '--',
    position: 'QC /Tester/Kiểm thử phần mềm...',
    recruitment: 'QC/Tester HN, HC...',
    round: 'Đã tuyển',
    rating: 2,
    applyDate: '18/07/2025',
    rowClass: '',
  },
  {
    name: 'Bùi Mỹ Uyên',
    avatar: 'BU',
    avatarClass: 'yellow',
    pill: null,
    phone: '0331 256 963',
    email: 'uyenbt.work@gmail.com',
    campaign: '--',
    position: 'Nhân viên kinh doanh HC...',
    recruitment: 'Nhân viên kinh doanh HC...',
    round: 'Offer',
    rating: 1,
    applyDate: '18/09/2025',
    rowClass: '',
  },
  {
    name: 'Bùi Thu Uyên',
    avatar: 'BU',
    avatarClass: 'yellow',
    pill: null,
    phone: '--',
    email: '--',
    campaign: '--',
    position: 'Nhân viên kinh doanh HC...',
    recruitment: 'Nhân viên kinh doanh HC...',
    round: 'Offer',
    rating: 0,
    applyDate: '18/09/2025',
    rowClass: 'row-warn',
  },
  {
    name: 'Trần Thị Mỹ Duyên',
    avatar: 'TD',
    avatarClass: 'green',
    pill: { text: 'Nhân viên', type: 'success' },
    phone: '0942 527 358',
    email: 'myduyensie@gmail.com',
    campaign: '--',
    position: 'QC /Tester/Kiểm thử phần mềm...',
    recruitment: 'QC/Tester HN, HC...',
    round: 'Đã tuyển',
    rating: 0,
    applyDate: '--',
    rowClass: 'row-warn',
  },
  {
    name: 'Ứng viên 112',
    avatar: 'UV',
    avatarClass: 'grey',
    pill: null,
    phone: '--',
    email: '--',
    campaign: '--',
    position: 'QC /Tester/Kiểm thử phần mềm...',
    recruitment: 'QC/Tester HN, HC...',
    round: 'Ứng tuyển',
    rating: 0,
    applyDate: '--',
    rowClass: '',
  },
  {
    name: 'Diệp Anh Vũ',
    avatar: 'DV',
    avatarClass: 'orange',
    pill: null,
    phone: '0 973 109 558',
    email: 'Vudiepanh590@gmail.com',
    campaign: '--',
    position: 'QC /Tester/Kiểm thử phần mềm...',
    recruitment: 'QC/Tester HN, HC...',
    round: 'Thi tuyển',
    rating: 0,
    applyDate: '27/08/2025',
    rowClass: '',
  },
  {
    name: 'Trần Thị Mỹ Duyên',
    avatar: 'TD',
    avatarClass: 'tomato',
    pill: { text: 'Liên hệ lại', type: 'danger' },
    phone: '0 942 527 358',
    email: 'myduyensie@gmail.com',
    campaign: '--',
    position: 'QC /Tester/Kiểm thử phần mềm...',
    recruitment: 'QC/Tester HN, HC...',
    round: 'Ứng tuyển',
    rating: 0,
    applyDate: '--',
    rowClass: '',
  },
  {
    name: 'TRẦN THANH TUẤN',
    avatar: 'TT',
    avatarClass: 'amber',
    pill: null,
    phone: '036 5 197 777',
    email: 'duongthao0114tb@gmail.com',
    campaign: '--',
    position: 'QC /Tester/Kiểm thử phần mềm...',
    recruitment: 'QC/Tester HN, HC...',
    round: 'Thi tuyển',
    rating: 0,
    applyDate: '27/08/2025',
    rowClass: '',
  },
])

const selectedIndex = ref(0)

const isMuted = (value) => value === '--'

const popupTitle = computed(() => (popupMode.value === 'edit' ? 'Chỉnh sửa thông tin ứng viên' : 'Thêm ứng viên'))

const getValue = (name) => {
  const form = candidateFormRef.value
  if (!form) return ''
  const field = form.elements.namedItem(name)
  if (!field) return ''
  if (field.type === 'checkbox') {
    return field.checked
  }
  return (field.value || '').toString().trim()
}

const collectCandidateData = () => ({
  name: getValue('name'),
  dob: getValue('dob'),
  gender: getValue('gender'),
  area: getValue('area'),
  phone: getValue('phone'),
  email: getValue('email'),
  address: getValue('address'),
  eduLevel: getValue('edu-level'),
  eduSchool: getValue('edu-school'),
  eduMajor: getValue('edu-major'),
  applyDate: getValue('apply-date'),
  source: getValue('source'),
  recruiter: getValue('recruiter'),
  collaborator: getValue('collaborator'),
  addReferee: Boolean(getValue('add-referee')),
  recentWorkplace: getValue('recent-workplace'),
  workCompany: getValue('work-company'),
  workStart: getValue('work-duration-start'),
  workEnd: getValue('work-duration-end'),
  workPosition: getValue('work-position'),
  workDescription: getValue('work-description'),
})

const setFormValue = (name, value) => {
  const form = candidateFormRef.value
  if (!form) return
  const field = form.elements.namedItem(name)
  if (!field) return
  field.value = value || ''
}

const openPopup = () => {
  popupMode.value = 'create'
  candidateFormRef.value?.reset()
  isPopupOpen.value = true
}

const openEditPopup = async (index = selectedIndex.value) => {
  selectedIndex.value = index
  const candidate = candidates.value[index]
  if (!candidate) return
  popupMode.value = 'edit'
  isPopupOpen.value = true
  await nextTick()
  setFormValue('name', candidate.name)
  setFormValue('phone', isMuted(candidate.phone) ? '' : candidate.phone)
  setFormValue('email', isMuted(candidate.email) ? '' : candidate.email)
  setFormValue('apply-date', isMuted(candidate.applyDate) ? '' : candidate.applyDate)
  setFormValue('work-position', isMuted(candidate.position) ? '' : candidate.position)
}

const selectCandidate = (index) => {
  selectedIndex.value = index
}

const closePopup = () => {
  isPopupOpen.value = false
}

const handleSubmit = (event) => {
  event.preventDefault()
  const payload = collectCandidateData()
  if (!payload.name) {
    notice.value = { type: 'error', message: 'Lưu không thành công. Vui lòng nhập họ và tên.' }
    clearTimeout(noticeTimer)
    noticeTimer = setTimeout(() => {
      notice.value = { type: '', message: '' }
    }, 2500)
    return
  }
  console.log('Candidate data:', payload)
  notice.value = { type: 'success', message: 'Lưu thành công.' }
  clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => {
    notice.value = { type: '', message: '' }
  }, 2500)
  isPopupOpen.value = false
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
          <label class="checkbox">
            <input type="checkbox" id="select-all" />
            <span class="checkbox-box"></span>
          </label>
          <div class="table-search">
            <span class="icon icon-search small"></span>
            <input class="table-search-input" type="text" placeholder="Tìm kiếm nhanh trong danh sách" />
          </div>
        </div>
                <div class="toolbar-right display-flex align-items-center">
          <button class="icon-btn ghost" type="button" aria-label="Lọc">?</button>
          <button class="icon-btn ghost" type="button" aria-label="Sắp xếp"></button>
          <button class="icon-btn ghost" type="button" aria-label="Làm mới">?</button>
          <button class="icon-btn ghost" type="button" aria-label="Ẩn cột">?</button>
        </div>
      </div>

      <div class="candidate-table-wrapper">
        <table class="candidate-table">
          <thead>
            <tr>
              <th class="col-checkbox"><input type="checkbox" disabled /></th>
              <th>Họ và tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Chiến dịch tuyển dụng</th>
              <th>Vị trí tuyển dụng</th>
              <th>Tin tuyển dụng</th>
              <th>Vòng tuyển dụng</th>
              <th>Đánh giá</th>
              <th>Ngày ứng tuyển</th>
              <th class="has-edit">Thao tác</th>

            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(candidate, index) in candidates"
              :key="candidate.name + index"
              :class="[candidate.rowClass, { 'row-selected': index === selectedIndex }]"
              @click="selectCandidate(index)"
            >
              <td><input type="checkbox" class="row-select" /></td>
              <td>
                <div class="cell-person">
                  <div class="avatar" :class="candidate.avatarClass">{{ candidate.avatar }}</div>
                  <div class="person-meta">
                    <div class="name">{{ candidate.name }}</div>
                    <span v-if="candidate.pill" class="pill" :class="candidate.pill.type">
                      {{ candidate.pill.text }}
                    </span>
                  </div>
                </div>
              </td>
              <td :class="{ muted: isMuted(candidate.phone) }">{{ candidate.phone }}</td>
              <td :class="{ muted: isMuted(candidate.email) }">{{ candidate.email }}</td>
              <td :class="{ muted: isMuted(candidate.campaign) }">{{ candidate.campaign }}</td>
              <td :class="{ muted: isMuted(candidate.position) }">{{ candidate.position }}</td>
              <td :class="{ muted: isMuted(candidate.recruitment) }">{{ candidate.recruitment }}</td>
              <td :class="{ muted: isMuted(candidate.round) }">{{ candidate.round }}</td>
              <td class="rating" :data-score="candidate.rating"></td>
              <td :class="{ muted: isMuted(candidate.applyDate) }">{{ candidate.applyDate }}</td>
              <td class="has-edit">
                <button class="row-edit-btn" type="button" aria-label="Chỉnh sửa thông tin ứng viên" @click.stop="openEditPopup(index)">&#9998;</button>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-footer display-flex justify-content-between align-items-center">
        <div class="total-records" data-total-count="5362">Tổng: 5362 bản ghi</div>
        <div class="pagination display-flex align-items-center">
          <span>Số bản ghi/trang</span>
          <div class="pill">25</div>
          <span>1 - 25 bản ghi</span>
          <div class="pagination-controls">
            <button aria-label="Trang trước" type="button">&lt;</button>
            <button class="active" type="button">1</button>
            <button aria-label="Trang sau" type="button">&gt;</button>
          </div>
        </div>
      </div>
    </section>
  </AppBody>
<div
    id="popup"
    class="popup-overlay"
    :class="{ 'is-open': isPopupOpen }"
    :aria-hidden="(!isPopupOpen).toString()"
    @click.self="closePopup"
  >
    <div class="popup-content">
      <span class="close-btn" role="button" aria-label="Đóng" @click="closePopup">&times;</span>
      <h2>{{ popupTitle }}</h2>

      <form id="candidate-form" ref="candidateFormRef" @submit.prevent="handleSubmit">
        <div class="drag-drop-area">
          Kéo thả hoặc bấm vào đây để tải CV lên<br />
          Chấp nhận file .doc, .docx, .pdf, .jpg, .jpeg, .png (Dung lượng &lt; 15 Mb)
        </div>

        <div class="form-row">
          <div class="form-group-image">Ảnh</div>
          <div class="form-group-full">
            <label for="name">Họ và tên <span class="required">*</span></label>
            <input type="text" id="name" name="name" placeholder="Nhập họ và tên" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group-half">
            <label for="dob">Ngày sinh</label>
            <div class="input-with-icon">
              <input type="text" id="dob" name="dob" placeholder="dd/MM/yyyy" class="date-input" />
              <i class="calendar-icon">??</i>
            </div>
          </div>
          <div class="form-group-half">
            <label for="gender">Giới tính</label>
            <select id="gender" name="gender">
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group-full">
            <label for="area">Khu vực</label>
            <div class="input-with-button">
              <select id="area" name="area" class="select-with-button">
                <option value="">Chọn giá trị</option>
                <option value="hn">Hà Nội</option>
                <option value="hcm">Hồ Chí Minh</option>
              </select>
              <button type="button" class="more-options-btn">...</button>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group-half">
            <label for="phone">Số điện thoại</label>
            <input type="tel" id="phone" name="phone" placeholder="Nhập số điện thoại" />
          </div>
          <div class="form-group-half">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Nhập email" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group-full">
            <label for="address">Địa chỉ</label>
            <input type="text" id="address" name="address" placeholder="Nhập địa chỉ" />
          </div>
        </div>

        <h3>Học vấn</h3>
        <div class="form-group-education">
          <label for="edu-level">- Trình độ đào tạo</label>
          <input type="text" id="edu-level" name="edu-level" placeholder="Nhập trình độ đào tạo" />
          <button type="button" class="plus-btn">+</button>
        </div>
        <div class="form-group-education">
          <label for="edu-school">- Nơi đào tạo</label>
          <input type="text" id="edu-school" name="edu-school" placeholder="Nhập nơi đào tạo" />
          <button type="button" class="plus-btn">+</button>
        </div>
        <div class="form-group-education">
          <label for="edu-major">- Chuyên ngành</label>
          <input type="text" id="edu-major" name="edu-major" placeholder="Nhập chuyên ngành" />
          <button type="button" class="plus-btn">+</button>
        </div>

        <div class="add-section-button">
          <button type="button" class="link-button">+ Thêm học vấn</button>
        </div>

        <div class="form-row">
          <div class="form-group-half">
            <label for="apply-date">Ngày ứng tuyển <span class="required">*</span></label>
            <div class="input-with-icon">
              <input type="text" id="apply-date" name="apply-date" value="27/10/2025" class="date-input" required />
              <i class="calendar-icon">??</i>
            </div>
          </div>
          <div class="form-group-half">
            <label for="source">Nguồn ứng viên</label>
            <select id="source" name="source">
              <option value="">Chọn nguồn ứng viên</option>
              <option value="ref">Giới thiệu</option>
              <option value="site">Website</option>
              <option value="jobsite">Job site</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group-half">
            <label for="recruiter">Nhân sự khai thác</label>
            <select id="recruiter" name="recruiter">
              <option value="">Chọn nhân sự</option>
              <option value="nga">Dinh Nga QTHT</option>
            </select>
          </div>
          <div class="form-group-half">
            <label for="collaborator">Cộng tác viên</label>
            <select id="collaborator" name="collaborator">
              <option value="">Chọn cộng tác viên</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <input type="checkbox" id="add-referee" name="add-referee" />
          <label for="add-referee" class="checkbox-label">Thêm nhanh người tham chiếu vào kho ứng viên</label>
        </div>

        <div class="add-section-button">
          <button type="button" class="link-button">+ Thêm người giới thiệu</button>
        </div>

        <div class="form-row">
          <div class="form-group-full">
            <label for="recent-workplace">Nơi làm việc gần đây</label>
            <input type="text" id="recent-workplace" name="recent-workplace" placeholder="Nhập nơi làm việc gần đây" />
          </div>
        </div>

        <div class="add-section-button">
          <button type="button" class="link-button">+ Thêm kinh nghiệm làm việc</button>
        </div>

        <div class="form-row">
          <div class="form-group-full">
            <label for="work-company">Nơi làm việc</label>
            <input type="text" id="work-company" name="work-company" placeholder="Nhập nơi làm việc" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group-half">
            <label for="work-duration-start">Thời gian</label>
            <div class="input-with-icon-range">
              <input type="text" id="work-duration-start" name="work-duration-start" placeholder="MM/yyyy" class="date-input" />
              <i class="calendar-icon">??</i>
              <span class="range-separator">-</span>
              <input type="text" id="work-duration-end" name="work-duration-end" placeholder="MM/yyyy" class="date-input" />
              <i class="calendar-icon">??</i>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group-full">
            <label for="work-position">Vị trí công việc</label>
            <input type="text" id="work-position" name="work-position" placeholder="Nhập vị trí công việc" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group-full">
            <label for="work-description">Mô tả công việc</label>
            <textarea id="work-description" name="work-description" rows="3" placeholder="Nhập mô tả công việc"></textarea>
          </div>
        </div>

        <div class="form-footer">
          <button type="button" class="cancel-btn" @click="closePopup">Hủy</button>
          <button type="submit" class="save-btn">Lưu</button>
        </div>
      </form>
    </div>
  </div>

  <div class="quick-actions">
    <button class="quick-btn primary">?</button>
    <button class="quick-btn info">?</button>
    <button class="quick-btn success">✓</button>
    <button class="quick-btn accent">??</button>
  </div>
</template>

<style scoped>
.row-selected {
  outline: 2px solid #2f80ed;
  outline-offset: -2px;
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

.has-edit {
  width: 72px;
  text-align: right;
}

.row-edit-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.candidate-table tbody tr:hover .row-edit-btn {
  opacity: 1;
}
</style>







