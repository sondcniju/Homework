// Hien popup tao ung vien (mode create/edit)
function showPopup(mode) {
    const popup = document.getElementById('popup');
    if (popup) {
        if (mode !== 'edit') {
            const form = popup.querySelector('#candidate-form');
            if (form) {
                form.dataset.mode = 'create';
                form.dataset.editIndex = '';
                form.reset();
            }
            const title = popup.querySelector('h2');
            if (title) title.textContent = 'Them ung vien';
        }
        popup.style.display = 'flex';
        popup.setAttribute('aria-hidden', 'false');
    }
}

// An popup tao ung vien
function hidePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'none';
        popup.setAttribute('aria-hidden', 'true');
    }
}

// Gan cac su kien mo/chan popup
function initPopup() {
    const popup = document.getElementById('popup');
    if (!popup) return;

    // open buttons (even if thêm sau)
    document.addEventListener('click', function (e) {
        const opener = e.target.closest('[data-open-popup]');
        if (opener) {
            e.preventDefault();
            showPopup();
        }
    });

    // Close popup when clicking outside the content
    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            hidePopup();
        }
    });
}

document.addEventListener('DOMContentLoaded', initPopup);
