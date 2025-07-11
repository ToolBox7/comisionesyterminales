// Datos iniciales
let providers = JSON.parse(localStorage.getItem('terminals')) || [
    { name: 'Mercado Pago', rate: 0.035, logo: '/logos/mercado-pago.png' },
    { name: 'Clip', rate: 0.036, logo: '/logos/clip.png' },
    { name: 'Uala Bis', rate: 0.029, logo: '/logos/uala-bis.png' },
    { name: 'Zettle', rate: 0.035, logo: '/logos/zettle.png' }
];

// Función para calcular comisiones
function calculate() {
    const amount = parseFloat(document.getElementById('amount').value);
    const resultsDiv = document.getElementById('results');
    
    if (isNaN(amount)) {
        resultsDiv.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show">
                Por favor ingresa un monto válido
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        return;
    }
    
    if (amount <= 0) {
        resultsDiv.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show">
                El monto debe ser mayor a cero
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        return;
    }
    
    let resultsHtml = `
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0">Resultados para $${amount.toFixed(2)}</h4>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Terminal</th>
                                <th>Comisión</th>
                                <th>IVA</th>
                                <th>Total Comisión</th>
                                <th class="text-success">Monto Neto</th>
                            </tr>
                        </thead>
                        <tbody>
    `;
    
    providers.forEach(provider => {
        const commission = amount * provider.rate;
        const iva = commission * 0.16;
        const totalCommission = commission + iva;
        const netAmount = amount - totalCommission;
        
        resultsHtml += `
            <tr>
                <td class="d-flex align-items-center">
                    <img src="${provider.logo}" alt="${provider.name}" class="terminal-logo me-2">
                    ${provider.name}
                </td>
                <td>$${commission.toFixed(2)}</td>
                <td>$${iva.toFixed(2)}</td>
                <td>$${totalCommission.toFixed(2)}</td>
                <td class="text-success fw-bold">$${netAmount.toFixed(2)}</td>
            </tr>
        `;
    });
    
    resultsHtml += `
                        </tbody>
                    </table>
                </div>
                <div class="alert alert-info mt-3">
                    <small>
                        <strong>Nota:</strong> Estas comisiones son referenciales y pueden variar según tu plan o negociación con cada proveedor.
                        Las comisiones mostradas incluyen el 16% de IVA.
                    </small>
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.innerHTML = resultsHtml;
    document.getElementById('ratingSection').style.display = 'block';
    
    // Scroll a resultados
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// Sistema de Calificación
document.querySelectorAll('.star-rating i').forEach(star => {
    star.addEventListener('click', function() {
        const rating = parseInt(this.getAttribute('data-rating'));
        document.querySelector('#ratingComment').style.display = 'block';
        
        // Actualizar estrellas visualmente
        document.querySelectorAll('.star-rating i').forEach((s, index) => {
            if (index < rating) {
                s.classList.remove('far');
                s.classList.add('fas');
            } else {
                s.classList.remove('fas');
                s.classList.add('far');
            }
        });
    });
});

document.getElementById('submitRating').addEventListener('click', function() {
    const rating = document.querySelectorAll('.star-rating .fas').length;
    const comment = document.querySelector('#ratingComment textarea').value;
    
    if (rating === 0) {
        alert('Por favor selecciona una calificación');
        return;
    }
    
    // Almacenar la calificación
    let ratings = JSON.parse(localStorage.getItem('ratings') || '[]');
    ratings.push({
        rating: rating,
        comment: comment,
        date: new Date().toISOString(),
        amount: document.getElementById('amount').value || null
    });
    localStorage.setItem('ratings', JSON.stringify(ratings));
    
    // Mostrar agradecimiento
    document.getElementById('ratingThanks').textContent = '¡Gracias por tu calificación!';
    document.getElementById('ratingThanks').style.display = 'block';
    document.getElementById('ratingComment').style.display = 'none';
    
    // Resetear estrellas
    document.querySelectorAll('.star-rating i').forEach(star => {
        star.classList.remove('fas');
        star.classList.add('far');
    });
    document.querySelector('#ratingComment textarea').value = '';
    
    setTimeout(() => {
        document.getElementById('ratingThanks').style.display = 'none';
    }, 3000);
});

// Sistema de Feedback
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('feedbackName').value,
        email: document.getElementById('feedbackEmail').value,
        message: document.getElementById('feedbackMessage').value,
        date: new Date().toISOString()
    };
    
    // Almacenar feedback
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push(formData);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    
    // Mostrar mensaje de éxito
    document.getElementById('feedbackSuccess').textContent = '¡Gracias por tu feedback! Tu mensaje ha sido enviado.';
    document.getElementById('feedbackSuccess').style.display = 'block';
    
    // Resetear formulario
    this.reset();
    
    setTimeout(() => {
        document.getElementById('feedbackSuccess').style.display = 'none';
    }, 5000);
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos
    document.querySelector('.btn-primary').addEventListener('click', calculate);
    document.getElementById('amount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculate();
    });
    
    // Cargar datos actualizados si hay conexión
    if (navigator.onLine) {
        fetch('./data/terminals.json')
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    providers = data;
                    localStorage.setItem('terminals', JSON.stringify(data));
                }
            })
            .catch(error => console.error('Error al cargar datos:', error));
    }
});
// Versión optimizada con manejo de errores
window.addEventListener('load', function() {
    const paypalButtonContainer = document.getElementById('donate-button');
    
    if (!paypalButtonContainer) return;
    
    // Carga condicional del SDK
    if (typeof PayPal === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
        script.charset = 'UTF-8';
        script.onload = renderPayPalButton;
        script.onerror = showFallbackButton;
        document.head.appendChild(script);
    } else {
        renderPayPalButton();
    }
    
    function renderPayPalButton() {
        try {
            PayPal.Donation.Button({
                env:'production',
                hosted_button_id: '92383VH3ZDLX8',
                image: {
                    src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif',
                    alt: 'Donar con PayPal',
                    title: 'PayPal - Donación segura'
                }
            }).render ('#donate-button');
        } catch (error) {
            console.error('Error al renderizar botón PayPal:', error);
            showFallbackButton();
        }
    }
    
    function showFallbackButton() {
        document.getElementById ('donate-button').innerHTML = `
            <a href="https://www.paypal.com/donate?hosted_button_id=92383VH3ZDLX8" 
               target="_blank" 
               rel="noopener noreferrer"
               class="btn btn-primary py-2 px-4">
                <i class="fab fa-paypal me-2"></i> Donar con PayPal
            </a>`;
    }
});