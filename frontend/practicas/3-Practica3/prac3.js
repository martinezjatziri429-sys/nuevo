// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');

    // Función de validación de email
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Función para mostrar mensajes de error en tiempo real
    const showError = (input, message) => {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.classList.add('input-error'); // Opcional: añade clase para estilo de error
    };

    // Función para ocultar mensajes de error
    const hideError = (input) => {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        errorElement.style.display = 'none';
        input.classList.remove('input-error'); // Opcional: quita clase de error
    };

    // Validación en tiempo real al escribir
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            hideError(input);
            if (input.name === 'email' && input.value.trim() !== '') {
                if (!isValidEmail(input.value)) {
                    showError(input, 'Por favor, introduce un email válido.');
                }
            }
        });
    });

    // Evento al enviar el formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita el envío por defecto

        let isValid = true;
        
        const nombre = form.elements['nombre'];
        const email = form.elements['email'];
        const mensaje = form.elements['mensaje'];

        // Validación de campos vacíos
        if (nombre.value.trim() === '') {
            showError(nombre, 'El nombre es obligatorio.');
            isValid = false;
        } else {
            hideError(nombre);
        }

        if (email.value.trim() === '') {
            showError(email, 'El email es obligatorio.');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Por favor, introduce un email válido.');
            isValid = false;
        } else {
            hideError(email);
        }

        if (mensaje.value.trim() === '') {
            showError(mensaje, 'El mensaje es obligatorio.');
            isValid = false;
        } else {
            hideError(mensaje);
        }

        // Si todos los campos son válidos
        if (isValid) {
            console.log('Formulario enviado con éxito.');
            // Muestra el modal
            modal.style.display = 'flex';
            
            // Lanza la animación de confeti
            createConfetti(50); // Aumentamos la cantidad de confeti

            // Resetea el formulario
            form.reset();
        }
    });

    // Cierra el modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        // Elimina el confeti al cerrar el modal
        document.querySelectorAll('.confetti').forEach(c => c.remove());
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.querySelectorAll('.confetti').forEach(c => c.remove());
        }
    });

    // Función para crear la animación de confeti
    const createConfetti = (count) => {
        const colors = ['#FFD700', '#FF6347', '#6A5ACD', '#3CB371', '#FF4500', '#DAA520', '#8A2BE2', '#00BFFF', '#ADFF2F', '#FF1493'];
        const container = document.body;

        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Posición aleatoria en todo el ancho de la pantalla
            confetti.style.left = `${Math.random() * 100}vw`; 
            
            // Tamaño aleatorio para variar
            const size = `${Math.random() * 8 + 5}px`; 
            confetti.style.width = size;
            confetti.style.height = size;

            confetti.style.animationDelay = `${Math.random() * 1.5}s`; // Retraso de animación para que no caigan todos a la vez
            confetti.style.animationDuration = `${Math.random() * 3 + 3}s`; // Duración de la animación
            container.appendChild(confetti);
        }
    };
});