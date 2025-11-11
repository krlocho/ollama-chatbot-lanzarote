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

