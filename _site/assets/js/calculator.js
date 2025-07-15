document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('commission-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const terminalType = document.getElementById('terminal-type').value;
    
    // Validación
    if (!amount || amount <= 0) {
      alert('Por favor ingrese un monto válido');
      return;
    }

    // Tasas (luego las moveremos a Firebase)
    const rates = {
      basic: 0.035,
      premium: 0.025
    };

    // Cálculos
    const commission = amount * rates[terminalType];
    const total = amount + commission;

    // Mostrar resultados
    document.getElementById('result').innerHTML = `
      <h3>Resultado</h3>
      <p><strong>Comisión:</strong> $${commission.toFixed(2)} MXN</p>
      <p><strong>Total:</strong> $${total.toFixed(2)} MXN</p>
    `;
  });
});