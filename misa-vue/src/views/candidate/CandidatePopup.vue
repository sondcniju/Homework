<script setup>
import { defineProps, defineEmits, toRef } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Thêm ứng viên',
  },
  formData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close', 'submit'])
const formData = toRef(props, 'formData')

const genderOptions = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nu' },
  { value: 'other', label: 'Khac' },
]
</script>

<template>
  <Teleport to ="body">
  <div id="popup" class="popup-overlay" :class="{ 'is-open': props.isOpen }" :aria-hidden="(!props.isOpen).toString()"
    @click.self="emit('close')">
    <div class="popup-content display-flex flex-direction-column">
      <div class="title">
        <div class="popup-title display align-items-left">{{ props.title }}</div>
        <div class="icon close-icon close-btn" role="button" aria-label="Đóng" @click="emit('close')"></div>
      </div>

      <form id="candidate-form" @submit.prevent="emit('submit', $event)">
        <div class="drag-drop-area">
          <div class="text-wrap">
            <div class="drag-input"><input type="file" accept=".docx, .pdf, .doc, .jpg, .jpeg, .png" class="file-input"> Kéo thả hoặc bấm vào đây để tải CV lên</div>
            <div class="drag-input-2">Chấp nhận file .doc, .docx, .pdf, .jpg, .jpeg, .png (Dung lượng &lt; 15 Mb)</div>
          </div>
        </div>

        <div class="form-content display-flex">
          <div class="form-image">
            <div class="avatar-popup">
              <div class="form-group-image">
                <span class="image-text">Ảnh</span>
              </div>
            </div>
          </div>
          <div class="form-basic">
            <div class="form-row">
              <div class="name-popup">Họ và tên <span class="color-red">*</span></div>
              <div class="Text-holder">
                <input type="text" class="name-input" id="name" name="name" placeholder="Nhập họ và tên" required
                  v-model="formData.name" />
              </div>
            </div>
            <div class="form-group-half">
              <div class="form-row">
                <div class="name-popup display-flex justify-content-between">
                  <div>
                    Ngày sinh
                  </div>
                  <div class="date-format">Ngày/tháng/năm</div>
                </div>
                <div class="input-with-icon">
                  <input type="text" id="dob" name="dob" placeholder="dd/MM/yyyy" class="date-input"
                    v-model="formData.dob" />
                  <i class="calendar-icon"></i>
                </div>
              </div>

              <div class="form-row">
                <div class="name-popup">Giới tính</div>
                <select id="gender" name="gender" v-model="formData.gender">
                  <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group-full">
                <label for="area">Khu vực</label>
                <div class="input-with-button">
                  <select id="area" name="area" class="select-with-button" v-model="formData.area">
                    <option value="">Chọn giá trị</option>
                    <option value="hn">Hà Nội</option>
                    <option value="hcm">Hồ Chí Minh</option>
                  </select>
                  <button type="button" class="more-options-btn">...</button>
                </div>
              </div>
            </div>

            <div class="form-group-half">
              <div class="form-row">
                <label for="phone">Số điện thoại</label>
                <input type="tel" id="phone" name="phone" placeholder="Nhập số điện thoại" v-model="formData.phone" />
              </div>
              <div class="form-row">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Nhập email" v-model="formData.email" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group-full">
                <label for="address">Địa chỉ</label>
                <input type="text" id="address" name="address" placeholder="Nhập địa chỉ" v-model="formData.address" />
              </div>
            </div>

            <h3>Học vấn</h3>

            <div class="form-group-education">
              <div class="from-group-educ">
                <div class="form-group-cont">
                  <div class="educ-block">
                    <div class="icon icon-import"></div>
                    <div class="name-pop">Trình độ đào tạo</div>
                  </div>
                  <div class="educ-block educ-input">
                    <input type="text" id="edu-level" name="edu-level" placeholder="Nhập trình độ đào tạo"
                      v-model="formData.eduLevel" />
                    <button type="button" class="plus-btn">+</button>
                  </div>
                </div>
                <div class="form-group-cont ">
                  <div class="educ-block">
                    <div class="icon icon-import"></div>
                    <div class="name-pop">Nơi đào tạo</div>
                  </div>
                  <div class="educ-block educ-input">
                    <input type="text" id="edu-school" name="edu-school" placeholder="Nhập nơi đào tạo"
                      v-model="formData.eduSchool" />
                    <button type="button" class="plus-btn">+</button>
                  </div>
                  <div class="educ-block educ-options">
                    <div class="educ-option-bar"></div>
                  </div>
                  <div class="educ-block educ-extra"></div>
                </div>
                <div class="form-group-cont ">
                  <div class="educ-block educ-label">
                    <div class="icon icon-import"></div>
                    <div class="name-pop">Chuyên ngành</div>
                  </div>
                  <div class="educ-block educ-input">
                    <input type="text" id="edu-major" name="edu-major" placeholder="Nhập chuyên ngành"
                      v-model="formData.eduMajor" />
                    <button type="button" class="plus-btn">+</button>
                  </div>
                  <div class="educ-block educ-options">
                    <div class="educ-option-bar"></div>
                  </div>
                  <div class="educ-block educ-extra"></div>
                </div>
              </div>
              <div class="add-section-button">
                <button type="button" class="link-button">+ Thêm học vấn</button>
              </div>

              <div class="form-group-half">
                <div class="form-row">
                    <label for="apply-date">Ngày ứng tuyển <span class="required">*</span></label>
                    <div class="input-with-icon">
                      <input type="text" id="apply-date" name="apply-date" class="date-input" required
                        v-model="formData.applyDate" />
                      <i class="calendar-icon">📅</i>
                    </div>
                </div>
                <div class="form-row">
                    <label for="source">Nguồn ứng viên</label>
                    <select id="source" name="source" v-model="formData.source">
                      <option value="">Chọn nguồn ứng viên</option>
                      <option value="ref">Giới thiệu</option>
                      <option value="site">Website</option>
                      <option value="jobsite">Job site</option>
                    </select>
                </div>
              </div>

              <div class="form-group-half">
                <div class="form-row">
                  <label for="recruiter">Nhân sự khai thác</label>
                  <select id="recruiter" name="recruiter" v-model="formData.recruiter">
                    <option value="">Chọn nhân sự</option>
                    <option value="nga">Đinh Nga QTHT</option>
                  </select>
                </div>
                <div class="form-row">
                  <label for="collaborator">Cộng tác viên</label>
                  <select id="collaborator" name="collaborator" v-model="formData.collaborator">
                    <option value="">Chọn cộng tác viên</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <input type="checkbox" id="add-referee" name="add-referee" v-model="formData.addReferee" />
                <label for="add-referee" class="checkbox-label">
                  Thêm nhanh người tham chiếu vào kho ứng viên
                </label>
              </div>

              <div class="add-section-button">
                <button type="button" class="link-button">+ Thêm người giới thiệu</button>
              </div>

              <div class="form-row">
                <div class="form-group-full">
                  <label for="recent-workplace">Nơi làm việc gần đây</label>
                  <input type="text" id="recent-workplace" name="recent-workplace"
                    placeholder="Nhập nơi làm việc gần đây" v-model="formData.recentWorkplace" />
                </div>
              </div>

              <div class="add-section-button">
                <button type="button" class="link-button">+ Thêm kinh nghiệm làm việc</button>
              </div>

              <div class="form-row">
                <div class="form-group-full">
                  <label for="work-company">Nơi làm việc</label>
                  <input type="text" id="work-company" name="work-company" placeholder="Nhập nơi làm việc"
                    v-model="formData.workCompany" />
                </div>
              </div>

              <div class="form-row">
                <label for="work-duration-start">Thời gian</label>
                <div class="input-with-icon-range">
                  <input type="text" id="work-duration-start" name="work-duration-start" placeholder="MM/yyyy"
                    class="date-input" v-model="formData.workStart" />
                  <i class="calendar-icon">📅</i>
                  <span class="range-separator">-</span>
                  <input type="text" id="work-duration-end" name="work-duration-end" placeholder="MM/yyyy"
                    class="date-input" v-model="formData.workEnd" />
                  <i class="calendar-icon">📅</i>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group-full">
                  <label for="work-position">Vị trí công việc</label>
                  <input type="text" id="work-position" name="work-position" placeholder="Nhập vị trí công việc"
                    v-model="formData.workPosition" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group-full">
                  <label for="work-description">Mô tả công việc</label>
                  <textarea id="work-description" name="work-description" rows="3" placeholder="Nhập mô tả công việc"
                    v-model="formData.workDescription"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div class="popup-footer display-flex justify-flex-end">
        <button type="button" class="pop-cancel-btn" @click="emit('close')">Hủy</button>
        <button type="submit" class="pop-save-btn" @click="emit('submit', $event)">Lưu</button>
      </div>
    </div>
  </div>
  </Teleport>
</template>
