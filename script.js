let eventsList = [
    {
        id: "1",
        name: "Winter Q4 Planning",
        date: "2025-12-10",
        description: "Legacy event for resource allocation and budgetary planning for the upcoming fiscal year."
    },
    {
        id: "2",
        name: "International Design Expo",
        date: "2026-03-15",
        description: "A massive gathering of creative minds showcasing the latest in systematic design and digital interaction."
    },
    {
        id: "3",
        name: "Future of AI Workshop",
        date: "2026-08-22",
        description: "Hands-on sessions regarding the integration of LLMs into workspace productivity tools."
    }
];

const eventsContainer = document.getElementById('events-container');
const eventForm = document.getElementById('event-form');
const validationMsg = document.getElementById('validation-msg');
const searchInput = document.getElementById('search-input');
const emptyState = document.getElementById('empty-state');

document.addEventListener('DOMContentLoaded', () => {
    sortEventsChronologically();
    renderApp(eventsList);
    
    eventForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', handleFiltering);
});

function renderApp(dataToRender) {
    eventsContainer.innerHTML = '';
    
    if (dataToRender.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    emptyState.classList.add('hidden');

    const midnightToday = new Date();
    midnightToday.setHours(0, 0, 0, 0);

    dataToRender.forEach(event => {
        const eventDateObj = new Date(event.date);
        eventDateObj.setHours(0, 0, 0, 0);
        
        const isPast = eventDateObj < midnightToday;
        const statusClass = isPast ? 'past' : 'upcoming';
        const badgeLabel = isPast ? 'Past' : 'Upcoming';

        const cardMarkup = `
            <article class="event-card ${statusClass}">
                <div class="event-content-block">
                    <div class="event-meta-row">
                        <span class="badge">${badgeLabel}</span>
                        <span class="event-date-text">${event.date}</span>
                    </div>
                    <h3 class="event-title">${cleanXSS(event.name)}</h3>
                    <p class="event-desc">${cleanXSS(event.description)}</p>
                </div>
                <div class="event-actions-block">
                    <button class="btn-icon-delete" title="Delete Event" onclick="removeEventRecord('${event.id}')">🗑️</button>
                    <button class="btn-arrow-detail" title="View Details">❯</button>
                </div>
            </article>
        `;
        eventsContainer.insertAdjacentHTML('beforeend', cardMarkup);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const nameEl = document.getElementById('event-name');
    const dateEl = document.getElementById('event-date');
    const descEl = document.getElementById('event-desc');

    if (!nameEl.value.trim() || !dateEl.value || !descEl.value.trim()) {
        validationMsg.classList.remove('hidden');
        return;
    }
    
    validationMsg.classList.add('hidden');

    const newCreatedRecord = {
        id: Date.now().toString(),
        name: nameEl.value.trim(),
        date: dateEl.value,
        description: descEl.value.trim()
    };

    eventsList.push(newCreatedRecord);
    sortEventsChronologically();
    
    eventForm.reset();
    searchInput.value = ''; 
    
    renderApp(eventsList);
}

function removeEventRecord(recordId) {
    eventsList = eventsList.filter(item => item.id !== recordId);
    handleFiltering();
}

function handleFiltering() {
    const filterQuery = searchInput.value.toLowerCase().trim();
    
    const matchedResults = eventsList.filter(item => {
        return item.name.toLowerCase().includes(filterQuery) || item.date.includes(filterQuery);
    });
    
    renderApp(matchedResults);
}

function sortEventsChronologically() {
    eventsList.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function cleanXSS(rawString) {
    return rawString
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}