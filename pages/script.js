
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.querySelector('form');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
                      const formData = {
                fecha: document.getElementById('fecha').value,
                hora: document.getElementById('hora').value,
                personas: document.getElementById('personas').value,
                email: document.getElementById('email').value || 'demo@ejemplo.com' // Campo de email agregado
            };
            
            if (!formData.fecha || !formData.hora || !formData.personas) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }
            
            enviarReserva(formData);
        });
    }
    
    agregarCampoEmail();
});

function agregarCampoEmail() {
    const form = document.querySelector('form');
    if (form && !document.getElementById('email')) {
        const personasField = document.getElementById('personas').parentElement.parentElement;
        const emailField = document.createElement('div');
        emailField.className = 'mb-4';
        emailField.innerHTML = `
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email para confirmación</label>
            <div class="relative">
                <input type="email" id="email" name="email" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro" placeholder="tu@email.com" />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                </div>
            </div>
        `;
        personasField.parentNode.insertBefore(emailField, personasField.nextSibling);
    }
}

function enviarReserva(formData) {
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    setTimeout(function() {
           const exito = Math.random() > 0.1; 
        
        if (exito) {

            mostrarConfirmacion(formData);
            
 
            enviarEmailConfirmacion(formData);
        } else {
            alert('Hubo un error al procesar su reserva. Por favor, intente nuevamente.');
        }
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

function mostrarConfirmacion(datos) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-md w-full p-6">
            <div class="text-center mb-4">
                <svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3 class="text-xl font-bold text-gray-800 mb-2">¡Reserva Confirmada!</h3>
                <p class="text-gray-600 mb-4">Hemos enviado un email de confirmación a ${datos.email}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 class="font-semibold text-gray-700 mb-2">Detalles de su reserva:</h4>
                <ul class="text-sm text-gray-600 space-y-1">
                    <li class="flex justify-between"><span>Fecha:</span> <span class="font-medium">${formatearFecha(datos.fecha)}</span></li>
                    <li class="flex justify-between"><span>Hora:</span> <span class="font-medium">${datos.hora}</span></li>
                    <li class="flex justify-between"><span>Personas:</span> <span class="font-medium">${datos.personas}</span></li>
                </ul>
            </div>
            <button id="cerrar-modal" class="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-accent transition-colors">
                Aceptar
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('cerrar-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
}

function formatearFecha(fecha) {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

function enviarEmailConfirmacion(datos) {
    console.log('Enviando email de confirmación a:', datos.email);
    console.log('Detalles de la reserva:', datos);
}