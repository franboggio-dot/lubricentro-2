/**
 * Contact and Quote Forms logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const quoteForm = document.getElementById('quoteForm');

    // General Contact Form
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('contactSubmitBtn');
            const responseDiv = document.getElementById('contactResponse');

            const data = {
                nombre: document.getElementById('c_nombre').value,
                email: document.getElementById('c_email').value,
                telefono: document.getElementById('c_telefono').value,
                vehiculo: document.getElementById('c_vehiculo').value,
                servicio: document.getElementById('c_servicio').value,
                fechaSugerida: document.getElementById('c_fecha').value,
                mensaje: document.getElementById('c_mensaje').value
            };

            try {
                btn.disabled = true;
                btn.innerText = 'Enviando...';

                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    responseDiv.style.color = '#25d366';
                    responseDiv.innerText = '¡Mensaje enviado con éxito! Nos contactaremos pronto.';
                    contactForm.reset();
                } else {
                    throw new Error(result.error || 'Error al enviar el mensaje');
                }
            } catch (error) {
                responseDiv.style.color = '#ef4444';
                responseDiv.innerText = 'Hubo un problema: ' + error.message;
            } finally {
                btn.disabled = false;
                btn.innerText = 'Enviar Mensaje';
            }
        });
    }

    // Business Quote Form
    if (quoteForm) {
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('quoteSubmitBtn');
            const responseDiv = document.getElementById('quoteResponse');

            const data = {
                empresa: document.getElementById('q_empresa').value,
                contacto: document.getElementById('q_contacto').value,
                telefono: document.getElementById('q_telefono').value,
                email: document.getElementById('q_email').value,
                cantidadFlota: document.getElementById('q_flotaSize').value,
                tipoServicio: document.getElementById('q_tipoServicio').value,
                mensaje: document.getElementById('q_mensaje').value
            };

            try {
                btn.disabled = true;
                btn.innerText = 'Procesando...';

                const response = await fetch('/api/quotes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    responseDiv.style.color = '#25d366';
                    responseDiv.innerText = 'Solicitud de cotización enviada. Un asesor B2B te contactará.';
                    quoteForm.reset();
                } else {
                    throw new Error(result.error || 'Error en la solicitud');
                }
            } catch (error) {
                responseDiv.style.color = '#ef4444';
                responseDiv.innerText = 'Error: ' + error.message;
            } finally {
                btn.disabled = false;
                btn.innerText = 'Enviar Solicitud';
            }
        });
    }
});
