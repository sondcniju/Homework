// Thu thap du lieu ung vien tu form va log ra console
(function () {
    // Lay gia tri trim tu input theo ten truong
    function getValue(form, name) {
        const el = form.elements[name];
        if (!el) return '';
        return (el.value || '').trim();
    }

    // Dong goi payload ung vien de phuc vu luu/kiem tra
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

    // Gan submit event de thu thap du lieu phuc vu debug
    function wireCandidateCollector() {
        const form = document.getElementById('candidate-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            // Chi log du lieu, khong thay the luong validate/save hien co
            const data = collectCandidateData(form);
            console.log('Candidate data:', data);
            window.latestCandidateData = data; // tien debug/truy xuat sau
        });
    }

    document.addEventListener('DOMContentLoaded', wireCandidateCollector);

    // public helper (neu can lay theo yeu cau khac)
    window.collectCandidateData = collectCandidateData;
})();
