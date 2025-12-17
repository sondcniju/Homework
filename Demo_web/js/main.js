// Thu thập dữ liệu ứng viên từ form và log/return payload
(function () {
    function getValue(form, name) {
        const el = form.elements[name];
        if (!el) return '';
        return (el.value || '').trim();
    }

    function collectCandidateData(form) {
        return {
            name: getValue(form, 'name'),
            dob: getValue(form, 'dob'),
            gender: getValue(form, 'gender'),
            area: getValue(form, 'area'),
            phone: getValue(form, 'phone'),
            email: getValue(form, 'email'),
            address: getValue(form, 'address'),
            eduLevel: getValue(form, 'edu-level'),
            eduSchool: getValue(form, 'edu-school'),
            eduMajor: getValue(form, 'edu-major'),
            applyDate: getValue(form, 'apply-date'),
            source: getValue(form, 'source'),
            recruiter: getValue(form, 'recruiter'),
            collaborator: getValue(form, 'collaborator'),
            recentWorkplace: getValue(form, 'recent-workplace'),
            workCompany: getValue(form, 'work-company'),
            workStart: getValue(form, 'work-duration-start'),
            workEnd: getValue(form, 'work-duration-end'),
            workPosition: getValue(form, 'work-position'),
            workDescription: getValue(form, 'work-description')
        };
    }

    function wireCandidateCollector() {
        const form = document.getElementById('candidate-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            // chỉ thu thập dữ liệu, không chặn luồng validate/hide đã có
            const data = collectCandidateData(form);
            console.log('Candidate data:', data);
            window.latestCandidateData = data; // tiện debug/truy xuất sau
        });
    }

    document.addEventListener('DOMContentLoaded', wireCandidateCollector);

    // public helper (nếu cần lấy theo yêu cầu khác)
    window.collectCandidateData = collectCandidateData;
})();
