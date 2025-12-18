// Render 5 mẫu ứng viên từ candidate.json, kèm tìm kiếm nhanh theo tên/email/điện thoại
(function () {
    const DATA_URL = '../data/candidate.json';
    const ROW_LIMIT = 5;
    let allCandidates = [];
    let selectionWired = false;

    // Chuan hoa gia tri hien thi rong
    function safe(value) {
        if (value === null || value === undefined) return '--';
        const str = String(value).trim();
        return str === '' ? '--' : str;
    }

    // Dinh dang ngay ve dd/MM/yyyy
    function formatDate(value) {
        if (!value) return '--';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '--';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Lay chu cai dau ho va ten lam avatar
    function initials(name) {
        if (!name) return '?';
        const parts = name.trim().split(/\s+/);
        const first = parts[0] ? parts[0][0] : '';
        const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
        return (first + last || first).toUpperCase();
    }

    // Quy doi diem 0-100 ve thang 0-5
    function normalizeScore(score) {
        const raw = Number(score) || 0;
        // dữ liệu có thể 0-100, quy về 0-5 sao
        const normalized = raw > 5 ? Math.round(raw / 20) : Math.round(raw);
        return Math.min(5, Math.max(0, normalized));
    }

    // Tao HTML cho mot dong ung vien
    function renderRow(item, index) {
        const score = normalizeScore(item.Score);
        const name = safe(item.CandidateName);
        const avatarColor = item.AvatarColor || '#48aef7';
        const avatar = `<span class="avatar" style="background:${avatarColor}">${initials(name)}</span>`;
        const sourceIndex = typeof item._sourceIndex === 'number' ? item._sourceIndex : index;

        return `
            <tr>
                <td class="col-checkbox"><input type="checkbox" class="row-select" aria-label="Chọn ứng viên"></td>
                <td>${safe(item.Mobile)}</td>
                <td>${safe(item.ChannelName)}</td>
                <td>
                    <div class="cell-person">
                        ${avatar}
                        <div class="person-meta">
                            <div class="name">${name}</div>
                        </div>
                    </div>
                </td>
                <td>${safe(item.Email)}</td>
                <td>${safe(item.RecruitmentCampaignNames)}</td>
                <td>${safe(item.JobPositionName)}</td>
                <td>${safe(item.RecruitmentName)}</td>
                <td>${safe(item.RecruitmentRoundName)}</td>
                <td><div class="rating" data-score="${score}" aria-label="${score} trên 5">★★★★★</div></td>
                <td>${formatDate(item.ApplyDate)}</td>
                <td>${safe(item.EducationDegreeName)}</td>
                <td>${safe(item.EducationPlaceName)}</td>
                <td>${safe(item.EducationMajorName)}</td>
                <td>${safe(item.WorkPlaceRecent)}</td>
                <td>${safe(item.AttractivePersonnel)}</td>
                <td>${safe(item.OrganizationUnitName)}</td>
                <td>${safe(item.Overall)}</td>
                <td>${safe(item.AreaName)}</td>
                <td>${safe(item.PresenterName)}</td>
                <td>${safe(item.ProbationInfoStatus)}</td>
                <td>${item.IsTalentPoolDetail ? 'Có' : 'Không'}</td>
                <td class="has-edit">
                    <button class="row-edit-btn" data-index="${sourceIndex}" type="button" aria-label="Chỉnh sửa">✎</button>
                </td>
            </tr>
        `;
    }

    // Cap nhat tong so ban ghi hien thi
    function updateTotal(count) {
        const totalEl = document.querySelector('.total-records');
        if (totalEl) {
            totalEl.dataset.totalCount = String(count);
            totalEl.textContent = `Tổng: ${count} bản ghi`;
        }
    }

    // To hop style khi check tung dong
    function toggleRowState(checkbox, state) {
        const row = checkbox.closest('tr');
        if (row) {
            row.classList.toggle('row-selected', state);
        }
    }

    // Gan su kien chon tat ca va tung checkbox
    function wireSelection(tbody) {
        const selectAll = document.getElementById('select-all');
        if (selectAll && !selectionWired) {
            selectAll.addEventListener('change', function () {
                const checked = this.checked;
                tbody.querySelectorAll('.row-select').forEach(cb => {
                    cb.checked = checked;
                    toggleRowState(cb, checked);
                });
            });
        }

        if (!selectionWired) {
            tbody.addEventListener('change', function (e) {
                if (e.target && e.target.classList.contains('row-select')) {
                    toggleRowState(e.target, e.target.checked);
                }
            });
            selectionWired = true;
        }
    }

    // Render bang ung vien tu mang du lieu
    function renderTable(items) {
        const tbody = document.getElementById('candidate-body');
        if (!tbody) return;

        const selectAll = document.getElementById('select-all');
        if (selectAll) selectAll.checked = false;

        tbody.innerHTML = items.map((item, idx) => renderRow(item, idx)).join('');
        updateTotal(items.length);
        wireSelection(tbody);
    }

    // Loc ung vien theo tu khoa ten/email/so dien thoai
    function filterCandidates(term) {
        const keyword = (term || '').trim().toLowerCase();
        if (!keyword) {
            renderTable(allCandidates);
            return;
        }
        const filtered = allCandidates.filter(item => {
            return [item.CandidateName, item.Email, item.Mobile]
                .some(field => (field || '').toLowerCase().includes(keyword));
        });
        renderTable(filtered);
    }

    // Bat su kien input search
    function bindSearch() {
        const searchInput = document.querySelector('.table-search-input');
        if (!searchInput) return;
        searchInput.addEventListener('input', function () {
            filterCandidates(this.value);
        });
    }

    // GoI API local candidate.json va render
    async function loadCandidates() {
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const payload = await response.json();
            allCandidates = (payload?.Data?.PageData || []).slice(0, ROW_LIMIT).map(function (item, idx) {
                item._sourceIndex = idx;
                return item;
            });
            renderTable(allCandidates);
            bindSearch();
        } catch (err) {
            console.error('Không thể tải dữ liệu ứng viên', err);
        }
    }

    document.addEventListener('DOMContentLoaded', loadCandidates);

    window.candidateTableApi = {
        getCandidateByIndex: function (index) {
            return allCandidates[index];
        }
    };
})();


