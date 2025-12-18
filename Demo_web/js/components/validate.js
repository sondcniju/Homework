(function () {
    const DATE_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    const VALID_GENDERS = new Set(['', 'male', 'female', 'other']);
    const VALID_AREAS = new Set(['', 'hn', 'hcm']);

    // Lay gia tri trim va gan lai vao form
    function getValue(form, name) {
        const control = form.elements[name];
        if (!control) return '';
        const value = (control.value || '').trim();
        control.value = value;
        return value;
    }

    // Xoa trang thai loi truoc do
    function clearValidationState(form) {
        form.querySelectorAll('.input-error').forEach(function (el) {
            el.classList.remove('input-error');
        });
        form.querySelectorAll('.field-error').forEach(function (el) {
            el.remove();
        });
    }

    // Danh dau loi va hien thong bao ben duoi field
    function flagError(field, message) {
        if (!field) return;
        field.classList.add('input-error');
        const container = field.closest('.input-with-icon') || field.parentElement;
        const error = document.createElement('div');
        error.className = 'field-error';
        error.textContent = message;
        (container || field).appendChild(error);
    }

    // Dong goi payload chi gom field can validate
    function buildPayload(form) {
        return {
            name: getValue(form, 'name'),
            dob: getValue(form, 'dob'),
            gender: getValue(form, 'gender'),
            area: getValue(form, 'area')
        };
    }

    // Kiem tra hop le cua payload
    function validatePayload(payload) {
        const errors = {};

        if (!payload.name) {
            errors.name = 'Vui long nhap ho va ten';
        }
        if (payload.dob && !DATE_REGEX.test(payload.dob)) {
            errors.dob = 'Nhap dung dinh dang dd/MM/yyyy';
        }
        if (!VALID_GENDERS.has(payload.gender)) {
            errors.gender = 'Gia tri gioi tinh khong hop le';
        }
        if (!VALID_AREAS.has(payload.area)) {
            errors.area = 'Khu vuc khong hop le';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    // Xu ly submit form ung vien
    function handleCandidateSubmit(event) {
        event.preventDefault();
        const form = event.target;
        clearValidationState(form);

        const payload = buildPayload(form);
        const result = validatePayload(payload);

        if (!result.isValid) {
            Object.keys(result.errors).forEach(function (fieldName) {
                flagError(form.elements[fieldName], result.errors[fieldName]);
            });
            return;
        }

        console.log('Candidate payload is valid', payload);
        alert('Du lieu hop le, dang luu...');

        if (typeof hidePopup === 'function') {
            hidePopup();
        }

        form.reset();
    }

    // Gan validator cho form khi DOM san
    function initValidation() {
        const form = document.getElementById('candidate-form');
        if (!form) return;
        form.addEventListener('submit', handleCandidateSubmit);
    }

    document.addEventListener('DOMContentLoaded', initValidation);

    window.candidateValidator = {
        clearValidationState,
        validatePayload,
        handleCandidateSubmit
    };
})();
