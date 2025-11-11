document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES GLOBALES Y ELEMENTOS DEL DOM ---
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const modelSelect = document.getElementById('model-select');
    const statusMessage = document.getElementById('status-message');

    const OLLAMA_BASE_URL = 'http://localhost:11434';
    const OLLAMA_GENERATE_URL = `${OLLAMA_BASE_URL}/api/generate`;
    const OLLAMA_TAGS_URL = `${OLLAMA_BASE_URL}/api/tags`;

    let currentModel = ''; // Almacena el nombre del modelo actualmente seleccionado

    // --- FUNCIONES DE CHAT ---

    // Añade o actualiza un mensaje en el chat box
    function addMessage(text, sender, isNew = true) {
        if (isNew) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            messageDiv.innerHTML = text; 
            chatBox.appendChild(messageDiv);
            // Hacer scroll para ver el mensaje más reciente
            chatBox.scrollTop = chatBox.scrollHeight; 
            return messageDiv;
        } else {
            // Solo forzar scroll si no es un mensaje nuevo (útil en streaming)
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    // Lógica para enviar el mensaje a Ollama y manejar el streaming
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message || !currentModel) {
            if (!currentModel) statusMessage.textContent = 'Por favor, selecciona un modelo primero.';
            return; 
        }

        // 1. Mostrar mensaje del usuario
        addMessage(message, 'user');
        userInput.value = '';
        sendButton.disabled = true;

        // 2. Crear el elemento para la respuesta del bot (inicialmente vacío)
        let botMessageElement = addMessage('', 'bot');

        try {
            // 3. Petición a la API de Ollama con streaming
            const response = await fetch(OLLAMA_GENERATE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: currentModel, // ¡Usa el modelo seleccionado!
                    prompt: message,
                    stream: true
                    // Puedes añadir 'num_predict', 'system', etc. aquí
                })
            });

            if (!response.ok) {
                throw new Error(`Error al conectar con Ollama: HTTP ${response.status}`);
            }

            // 4. Leer la respuesta como un stream (flujo de datos)
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponseText = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const parts = chunk.split('\n').filter(p => p.trim() !== '');

                for (const part of parts) {
                    try {
                        const data = JSON.parse(part);
                        if (data.response) {
                            fullResponseText += data.response;
                            // Actualiza el contenido del mensaje del bot
                            botMessageElement.textContent = fullResponseText; 
                            addMessage(null, null, false); // Forzar scroll
                        }
                        if (data.done) break;
                    } catch (e) {
                        // Ignorar fragmentos de JSON inválidos si el stream se interrumpe
                    }
                }
            }

        } catch (error) {
            console.error('Error de comunicación:', error);
            botMessageElement.textContent = `Error: No se pudo conectar con Ollama o el modelo falló. Asegúrate de que Ollama esté activo y de que el modelo '${currentModel}' esté descargado.`;
            botMessageElement.className += ' error';
        } finally {
            sendButton.disabled = false;
            userInput.focus();
        }
    }

    // --- FUNCIÓN DE GESTIÓN DE MODELOS ---

    // Obtiene la lista de modelos descargados de la API de Ollama
    async function fetchModels() {
        try {
            const response = await fetch(OLLAMA_TAGS_URL);
            if (!response.ok) {
                throw new Error(`Ollama no responde o no está activo.`);
            }

            const data = await response.json();
            const models = data.models;

            if (models && models.length > 0) {
                modelSelect.innerHTML = ''; // Limpiar el 'Cargando...'
                
                models.forEach(model => {
                    const option = document.createElement('option');
                    // El nombre del modelo es 'name' (ej. "mistral:latest")
                    option.value = model.name; 
                    option.textContent = model.name;
                    modelSelect.appendChild(option);
                });
                
                // Inicializar el modelo actual y habilitar
                currentModel = models[0].name; 
                modelSelect.disabled = false;
                statusMessage.textContent = `Modelos cargados. Usando ${currentModel}.`;

            } else {
                modelSelect.innerHTML = '<option value="">No hay modelos descargados</option>';
                statusMessage.textContent = '¡Descarga un modelo con "ollama pull [nombre]"!';
                modelSelect.disabled = true;
            }

        } catch (error) {
            console.error("Error al obtener modelos:", error);
            modelSelect.innerHTML = '<option value="">Error de conexión</option>';
            statusMessage.textContent = 'Error: Ollama no está activo en http://localhost:11434.';
            modelSelect.disabled = true;
        }
    }

    // --- INICIALIZACIÓN Y MANEJO DE EVENTOS ---
    
    // 1. Cargar los modelos al iniciar la página
    fetchModels();

    // 2. Manejar el cambio de modelo por parte del usuario
    modelSelect.addEventListener('change', (e) => {
        currentModel = e.target.value;
        statusMessage.textContent = `Modelo cambiado a ${currentModel}.`;
        // Opcional: Limpiar la caja de chat al cambiar de modelo
        // chatBox.innerHTML = '<div class="message bot-message">Modelo cambiado. ¿En qué puedo ayudarte ahora?</div>';
    });

    // 3. Manejar el envío de mensajes al hacer clic o presionar Enter
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});