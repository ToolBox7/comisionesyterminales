// Variables globales
let currentEditId = null;

// Cargar terminales
function loadTerminals() {
    const terminals = JSON.parse(localStorage.getItem('terminals')) || [];
    const tableBody = document.querySelector('#terminalsTable tbody');
    tableBody.innerHTML = '';

    terminals.forEach((terminal, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${terminal.name}</td>
            <td><img src="${terminal.logo || 'https://via.placeholder.com/50'}" alt="${terminal.name}" height="30"></td>
            <td>${(terminal.rate * 100).toFixed(2)}%</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editTerminal(${index})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTerminal(${index})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Cargar feedback
function loadFeedback() {
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    const tableBody = document.querySelector('#feedbackTable tbody');
    tableBody.innerHTML = '';

    feedbacks.forEach(feedback => {
        const date = new Date(feedback.date);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</td>
            <td>${feedback.name}</td>
            <td>${feedback.email}</td>
            <td>${feedback.message}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Cargar calificaciones
function loadRatings() {
    const ratings = JSON.parse(localStorage.getItem('ratings')) || [];
    const tableBody = document.querySelector('#ratingsTable tbody');
    tableBody.innerHTML = '';

    // Calcular promedio y total
    if (ratings.length > 0) {
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const average = total / ratings.length;
        document.getElementById('averageRating').textContent = average.toFixed(1);
        document.getElementById('totalRatings').textContent = ratings.length;
    }

    ratings.forEach(rating => {
        const date = new Date(rating.date);
        const stars = '★'.repeat(rating.rating) + '☆'.repeat(5 - rating.rating);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${date.toLocaleDateString()}</td>
            <td>
                <span class="text-warning">${stars}</span> (${rating.rating}/5)
            </td>
            <td>${rating.comment || 'Sin comentario'}</td>
            <td>${rating.amount ? '$' + parseFloat(rating.amount).toFixed(2) : 'N/A'}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Agregar nueva terminal
document.getElementById('saveTerminalBtn').addEventListener('click', function() {
    const name = document.getElementById('terminalName').value.trim();
    const rate = parseFloat(document.getElementById('terminalRate').value);
    const logo = document.getElementById('terminalLogo').value.trim();

    if (!name || isNaN(rate)) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }

    const terminal = {
        name: name,
        rate: rate,
        logo: logo || null
    };

    let terminals = JSON.parse(localStorage.getItem('terminals')) || [];
    terminals.push(terminal);
    localStorage.setItem('terminals', JSON.stringify(terminals));

    // Cerrar modal y resetear formulario
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTerminalModal'));
    modal.hide();
    document.getElementById('terminalForm').reset();

    // Recargar tabla
    loadTerminals();
});

// Editar terminal
function editTerminal(index) {
    const terminals = JSON.parse(localStorage.getItem('terminals'));
    const terminal = terminals[index];

    document.getElementById('editTerminalId').value = index;
    document.getElementById('editTerminalName').value = terminal.name;
    document.getElementById('editTerminalRate').value = terminal.rate;
    document.getElementById('editTerminalLogo').value = terminal.logo || '';

    const modal = new bootstrap.Modal(document.getElementById('editTerminalModal'));
    modal.show();
}

document.getElementById('updateTerminalBtn').addEventListener('click', function() {
    const index = document.getElementById('editTerminalId').value;
    const name = document.getElementById('editTerminalName').value.trim();
    const rate = parseFloat(document.getElementById('editTerminalRate').value);
    const logo = document.getElementById('editTerminalLogo').value.trim();

    if (!name || isNaN(rate)) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }

    let terminals = JSON.parse(localStorage.getItem('terminals'));
    terminals[index] = {
        name: name,
        rate: rate,
        logo: logo || null
    };
    localStorage.setItem('terminals', JSON.stringify(terminals));

    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editTerminalModal'));
    modal.hide();

    // Recargar tabla
    loadTerminals();
});

// Eliminar terminal
function deleteTerminal(index) {
    if (confirm('¿Estás seguro de eliminar esta terminal?')) {
        let terminals = JSON.parse(localStorage.getItem('terminals'));
        terminals.splice(index, 1);
        localStorage.setItem('terminals', JSON.stringify(terminals));
        loadTerminals();
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadTerminals();
    loadFeedback();
    loadRatings();

    // Configurar eventos de los tabs
    const triggerTabList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tab"]'));
    triggerTabList.forEach(triggerEl => {
        triggerEl.addEventListener('click', function(event) {
            event.preventDefault();
            const tabId = this.getAttribute('href').substring(1);
            loadTabContent(tabId);
        });
    });

    // Cargar contenido inicial del tab activo
    const activeTab = document.querySelector('.nav-link.active').getAttribute('href').substring(1);
    loadTabContent(activeTab);
});

function loadTabContent(tabId) {
    switch(tabId) {
        case 'terminales':
            loadTerminals();
            break;
        case 'feedback':
            loadFeedback();
            break;
        case 'calificaciones':
            loadRatings();
            break;
    }
}