function showPopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'flex';
        popup.setAttribute('aria-hidden', 'false');
    }
}

function hidePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'none';
        popup.setAttribute('aria-hidden', 'true');
    }
}

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
