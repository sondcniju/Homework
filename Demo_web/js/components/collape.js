const sidebar = document.getElementById("sidebar");
const btn = document.getElementById("collapseBtn");

btn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});
