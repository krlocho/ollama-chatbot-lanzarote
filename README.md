# 🌵 Ollama Chatbot Local

Este es un proyecto de chatbot web ligero que se ejecuta completamente en local. Utiliza **Ollama** como backend para la generación de lenguaje y una interfaz de usuario simple construida con HTML, CSS (con temática de Lanzarote) y JavaScript.



---

## 🚀 Requisitos Previos

Para ejecutar este chatbot, necesitas tener instalados y funcionando los siguientes componentes:

1.  **Ollama:** El servidor de modelos de lenguaje local.
    * https://ollama.com
2.  **Un Modelo de Lenguaje:** Debes tener al menos un modelo descargado. Recomendamos `llama2` o `mistral` para empezar.

    ```bash
    # Ejemplo:
    ollama pull mistral
    ```
3.  **Un Servidor Web Local Simple:** Para evitar problemas de seguridad del navegador (CORS), el frontend debe servirse a través de HTTP (no abrir el archivo directamente).

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para poner en marcha el chatbot en tu máquina local.

### 1. Clonar el Repositorio
### 2. Iniciar el Backend (Ollama)

Asegúrate de que el servicio de Ollama esté ejecutándose en segundo plano en http://localhost:11434.

Bash
# Si no está activo, ejecuta este comando:
ollama serve
### 3. Iniciar el Frontend (Servidor Web Local)

Para servir los archivos HTML, CSS y JS, inicia un servidor web simple desde la carpeta del proyecto (requiere Python 3):

Bash
python3 -m http.server 8000
### 4. Acceder al Chatbot

Una vez que ambos servidores estén activos, abre tu navegador y navega a la siguiente dirección:

http://localhost:8000/
### 5. Configurar Modelo

En la interfaz web:

El menú desplegable "Modelo" se llenará automáticamente con todos los modelos que tengas descargados de Ollama.

Selecciona el modelo (ej. mistral:latest) para iniciar la conversación.

