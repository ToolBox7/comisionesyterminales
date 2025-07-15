// assets/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript cargado correctamente');
    
    // Aquí irá toda la lógica de tu calculadora
    // Por ahora solo un ejemplo básico:
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Navegando a:', this.href);
        });
    });
});