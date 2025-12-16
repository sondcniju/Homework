function showPopup() {
    const popup = document.getElementById('popup');
    if (popup) popup.style.display = 'flex';
}

function hidePopup() {
    const popup = document.getElementById('popup');
    if (popup) popup.style.display = 'none';
}

function initPopup() {
    const popup = document.getElementById('popup');
    const form = document.getElementById('candidate-form');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            alert('Thông tin đã được lưu!');
            hidePopup();
        });
    }

    // Đóng popup khi click ra ngoài
    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            hidePopup();
        }
    });
}

document.addEventListener('DOMContentLoaded', initPopup);
