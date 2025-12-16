// Simple search for candidate table with highlight

document.addEventListener('DOMContentLoaded', function () {
    const input = document.querySelector('.table-search-input');
    const tableBody = document.querySelector('.candidate-table tbody');
    const totalEl = document.querySelector('.total-records');
    if (!input || !tableBody) return;

    const rows = Array.from(tableBody.querySelectorAll('tr'));

    // store original text content of each cell to allow restoring
    rows.forEach(r => {
        const cells = Array.from(r.querySelectorAll('td'));
        r._orig = cells.map(td => td.textContent);
    });

    function highlightText(text, terms) {
        const pattern = new RegExp('(' + terms.map(t => escapeRegExp(t)).join('|') + ')', 'ig');
        return text.replace(pattern, '<mark class="hl">$1</mark>');
    }

    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function updateCount() {
        if (!totalEl) return;
        const visible = rows.filter(r => r.style.display !== 'none').length;
        const totalData = totalEl.dataset.totalCount || rows.length;
        const total = Number(totalData) || rows.length;
        const prefix = total && total !== visible ? `${visible}/${total}` : `${visible}`;
        totalEl.textContent = `Tổng: ${prefix} bản ghi`;
    }

    function filterRows(q) {
        const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);

        rows.forEach(r => {
            const rowText = r.textContent.toLowerCase();
            const match = terms.length === 0 || terms.every(t => rowText.indexOf(t) !== -1);
            r.style.display = match ? '' : 'none';

            const tds = Array.from(r.querySelectorAll('td'));
            tds.forEach((td, i) => {
                if (td.classList.contains('col-checkbox')) return;
                const orig = r._orig && r._orig[i] ? r._orig[i] : td.textContent;
                td.innerHTML = match && terms.length ? highlightText(orig, terms) : orig;
            });
        });
        updateCount();
    }

    input.addEventListener('input', function (e) {
        filterRows(e.target.value);
    });

    // initialize count
    updateCount();
});
