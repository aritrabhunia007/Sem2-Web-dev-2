// ============================================
// SMART EVENT DASHBOARD - JAVASCRIPT
// ============================================

// ============================================
// 1. DOM SELECTION & TRAVERSAL
// ============================================

// Select form elements
const eventForm = document.getElementById('eventForm');
const eventTitleInput = document.getElementById('eventTitle');
const eventDateInput = document.getElementById('eventDate');
const eventDescriptionInput = document.getElementById('eventDescription');
const eventTypeSelect = document.getElementById('eventType');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Select event display elements
const eventsContainer = document.getElementById('eventsContainer');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');

// Select demo elements
const pressedKeyElement = document.getElementById('pressedKey');

// ============================================
// 2. DATA STRUCTURE & STATE MANAGEMENT
// ============================================

let events = [];

let editingId = null;

// Sample events data
const sampleEvents = [
    {
        id: 1,
        title: 'Web Development Conference',
        date: '2026-02-15',
        type: 'conference',
        description: 'Annual conference on modern web technologies.'
    },
    {
        id: 2,
        title: 'JavaScript Workshop',
        date: '2026-02-20',
        type: 'workshop',
        description: 'Hands-on JavaScript learning session.'
    }
];

// ============================================
// 3. UTILITY FUNCTIONS
// ============================================

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Clear form inputs
function clearForm() {
    eventTitleInput.value = '';
    eventDateInput.value = '';
    eventDescriptionInput.value = '';
    eventTypeSelect.value = 'conference';
    editingId = null;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Get icon for event type
function getEventIcon(type) {
    const icons = {
        conference: '📊',
        webinar: '💻',
        workshop: '🛠️',
        meeting: '📅'
    };
    return icons[type] || '📅';
}

// ============================================
// 4. RENDER EVENTS - Dynamic Card Creation
// ============================================

function renderEvents() {
    // Clear container
    eventsContainer.innerHTML = '';

    if (events.length === 0) {
        // 6. TEXT MANIPULATION - Create empty state
        eventsContainer.innerHTML = '<div class="empty-state">No events yet. Add your first event!</div>';
        return;
    }

    // 2. DYNAMIC EVENT CARDS - Create card for each event
    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);
    });
}

// Create a single event card element
function createEventCard(event) {
    // 2. DYNAMIC EVENT CARDS - Create DOM elements
    const card = document.createElement('div');
    card.className = `event-card`;
    card.id = `event-${event.id}`;

    const icon = getEventIcon(event.type);

    // Build card HTML with all event details
    card.innerHTML = `
        <div class="event-card-header">
            <div class="event-title-group">
                <h3>${escapeHtml(event.title)}</h3>
                <span class="event-badge ${event.type}">
                    ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
            </div>
            <div class="event-actions">
                <button class="btn-icon btn-delete" data-action="delete" data-id="${event.id}" title="Delete event">
                    ❌
                </button>
            </div>
        </div>

        <div class="event-details">
            <div class="event-detail">
                <span class="event-detail-icon">📅</span>
                <span>${formatDate(event.date)}</span>
            </div>
        </div>

        ${event.description ? `<div class="event-description">${escapeHtml(event.description)}</div>` : ''}
    `;

    return card;
}

// ============================================
// 5. EVENT HANDLING & INTERACTION
// ============================================

// Form submission handler
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = eventTitleInput.value.trim();
    const date = eventDateInput.value;
    const description = eventDescriptionInput.value.trim();
    const type = eventTypeSelect.value;

    // Validate inputs
    if (!title || !date) {
        alert('Please fill in all required fields');
        return;
    }

    if (editingId) {
        // Update existing event
        const eventIndex = events.findIndex(e => e.id === editingId);
        if (eventIndex !== -1) {
            events[eventIndex] = {
                ...events[eventIndex],
                title,
                date,
                description,
                type
            };
        }
        editingId = null;
        updateFormUI();
    } else {
        // Create new event
        const newEvent = {
            id: Date.now(),
            title,
            date,
            description,
            type
        };
        events.push(newEvent);
    }

    clearForm();
    renderEvents();
});

// ============================================
// 6. EVENT DELEGATION
// ============================================
// Using event delegation to handle dynamically created elements

eventsContainer.addEventListener('click', (e) => {
    // 4. EVENT HANDLING - Event delegation pattern
    const deleteBtn = e.target.closest('[data-action="delete"]');

    if (deleteBtn) {
        const eventId = parseInt(deleteBtn.getAttribute('data-id'));
        handleDeleteEvent(eventId);
    }
});

// Delete event handler
function handleDeleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        events = events.filter(e => e.id !== eventId);
        renderEvents();
    }
}

// Update form UI when editing
function updateFormUI() {
    if (editingId) {
        // 6. TEXT & STYLE MANIPULATION - Update button text
        submitBtn.textContent = 'Update Event';
        cancelBtn.classList.remove('hidden');
    } else {
        submitBtn.textContent = 'Add Event';
        cancelBtn.classList.add('hidden');
    }
}

// Cancel edit button
cancelBtn.addEventListener('click', () => {
    editingId = null;
    clearForm();
    updateFormUI();
});

// ============================================
// CLEAR ALL EVENTS BUTTON
// ============================================

clearBtn.addEventListener('click', () => {
    if (events.length > 0 && confirm('Clear all events?')) {
        events = [];
        renderEvents();
    }
});

// ============================================
// ADD SAMPLE EVENTS BUTTON
// ============================================

sampleBtn.addEventListener('click', () => {
    events = [...sampleEvents];
    renderEvents();
});

// ============================================
// DOM MANIPULATION DEMO - Keyboard Events
// ============================================

document.addEventListener('keydown', (e) => {
    // 4. EVENT HANDLING - Keyboard event
    // 6. TEXT MANIPULATION - Update DOM text content
    
    let keyName = e.key;
    
    // Map key names for display
    if (e.key === ' ') {
        keyName = 'Space';
    } else if (e.shiftKey) {
        keyName = 'Shift';
    } else if (e.ctrlKey) {
        keyName = 'Ctrl';
    } else if (e.altKey) {
        keyName = 'Alt';
    }
    
    pressedKeyElement.textContent = keyName;
});

// ============================================
// INITIALIZATION
// ============================================

// Initialize on page load
renderEvents();