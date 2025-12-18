// Mo popup edit va dien san du lieu ung vien
(function () {
    function formatDate(value) {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function setField(form, name, value) {
        const control = form.elements[name];
        if (!control) return;
        control.value = value ?? '';
    }

    function fillFormFromCandidate(form, candidate, index) {
        if (!candidate) return;
        if (window.candidateValidator?.clearValidationState) {
            window.candidateValidator.clearValidationState(form);
        }
        form.reset();

        setField(form, 'name', candidate.CandidateName || '');
        setField(form, 'phone', candidate.Mobile || '');
        setField(form, 'email', candidate.Email || '');
        setField(form, 'area', candidate.Area || candidate.AreaCode || '');
        setField(form, 'source', candidate.ChannelName || '');
        setField(form, 'apply-date', formatDate(candidate.ApplyDate));
        setField(form, 'recent-workplace', candidate.WorkPlaceRecent || '');
        setField(form, 'work-company', candidate.WorkPlaceRecent || '');
        setField(form, 'work-position', candidate.JobPositionName || '');
        setField(form, 'work-description', candidate.RecruitmentName || '');

        form.dataset.mode = 'edit';
        form.dataset.editIndex = index != null ? String(index) : '';

        const title = form.closest('#popup')?.querySelector('h2');
        if (title) title.textContent = 'Chinh sua ung vien';
    }

    function openEditPopup(candidate, index) {
        const form = document.getElementById('candidate-form');
        if (!form || !candidate) return;
        fillFormFromCandidate(form, candidate, index);
        if (typeof showPopup === 'function') {
            showPopup('edit');
        }
    }

    function handleEditClick(event) {
        const btn = event.target.closest('.row-edit-btn');
        if (!btn) return;
        const index = Number(btn.dataset.index);
        if (Number.isNaN(index)) return;
        const candidate = window.candidateTableApi?.getCandidateByIndex(index);
        if (!candidate) return;
        openEditPopup(candidate, index);
    }

    document.addEventListener('DOMContentLoaded', function () {
        const tbody = document.getElementById('candidate-body');
        if (!tbody) return;
        tbody.addEventListener('click', handleEditClick);
    });
})();
