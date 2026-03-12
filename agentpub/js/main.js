document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('projects-container');
    if (typeof projectsData === 'undefined' || !container) return;

    // Sorting: Preprints first, then by year/month (newest first)
    const sortedData = [...projectsData].sort((a, b) => {
        if (a.isPreprint && !b.isPreprint) return -1;
        if (!a.isPreprint && b.isPreprint) return 1;
        
        // Both same category, sort by sortKey descending
        return b.sortKey.localeCompare(a.sortKey);
    });

    sortedData.forEach(p => {
        const el = document.createElement('article');
        el.className = 'publication-item';
        el.id = p.id;

        const linksHTML = [
            p.pdf  ? `<a class="link-btn" href="${p.pdf}" target="_blank"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Paper</a>` : '',
            p.url  ? `<a class="link-btn" href="${p.url}" target="_blank"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Project</a>` : ''
        ].filter(Boolean).join('');

        const venueText = p.status ? `${p.venue} ${p.status}` : p.venue;

        // Custom handling for long author lists
        let authorsHTML = `<p class="publication-authors">${p.authors}</p>`;
        if (p.authors.split(',').length > 10) {
            const shortAuthors = p.authors.split(',').slice(0, 5).join(', ') + '...';
            authorsHTML = `
                <p class="publication-authors long-authors">
                    <span class="authors-short">${shortAuthors}</span>
                    <span class="authors-full" style="display:none">${p.authors}</span>
                    <button class="toggle-authors" onclick="toggleAuthors(this)">Show all</button>
                </p>
            `;
        }

        el.innerHTML = `
            <div class="publication-content-wrapper">
                ${p.image ? `<div class="publication-image"><img src="${p.image}" alt="${p.title}"></div>` : ''}
                <div class="publication-text-info">
                    <div class="publication-header">
                        <h3 class="publication-title">${p.title}</h3>
                        ${linksHTML ? `<div class="publication-links inline-links">${linksHTML}</div>` : ''}
                    </div>
                    ${authorsHTML}
                    <p class="publication-venue"><span class="venue-name">${venueText}</span></p>
                    <p class="publication-desc">${p.description}</p>
                </div>
            </div>
        `;
        container.appendChild(el);
    });
});

window.toggleAuthors = (btn) => {
    const parent = btn.parentElement;
    const isFull = btn.innerText === 'Hide';
    parent.querySelector('.authors-short').style.display = isFull ? 'inline' : 'none';
    parent.querySelector('.authors-full').style.display = isFull ? 'none' : 'inline';
    btn.innerText = isFull ? 'Show all' : 'Hide';
};
