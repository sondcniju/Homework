// Toggle trang thai thu gon sidebar
const sidebar = document.getElementById("sidebar");
const btn = document.getElementById("collapseBtn");

// Chuyen doi class collapsed khi click nut
btn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});
