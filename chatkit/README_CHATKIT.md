# Sustituir el demo local por un agente real con OpenAI ChatKit

El `index.html` incluido funciona ahora con un **demo local** (sin API y sin costo) para presentar la experiencia al cliente.

Para conectarlo después a tu cuenta de OpenAI:

1. Crea/configura tu agente o implementación server-side.
2. Tu servidor debe crear una sesión de ChatKit y devolver un `client_secret` temporal.
3. No coloques `OPENAI_API_KEY` directamente en `index.html` ni en JavaScript público.
4. En producción, autentica al usuario y usa un identificador único por usuario al crear la sesión.
5. Carga el script oficial de ChatKit en el frontend y haz que `getClientSecret()` consulte tu endpoint `/api/chatkit/session`.

Script oficial de frontend:

```html
<script src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js" async></script>
```

Esquema de frontend (referencia, no activo en este demo):

```js
const chatkit = document.getElementById("my-chat");
chatkit.setOptions({
  api: {
    async getClientSecret() {
      const res = await fetch("/api/chatkit/session", { method: "POST" });
      const { client_secret } = await res.json();
      return client_secret;
    }
  }
});
```

## Por qué no está “anclado” automáticamente a tu cuenta en este ZIP
Un HTML estático no debe contener la clave secreta de tu cuenta. La integración real requiere un backend/endpoint que cree la sesión de ChatKit de forma segura. Cuando tengas el dominio/hosting y la credencial/configuración del proyecto, este demo se puede sustituir sin rediseñar la sección.

Documentación oficial consultada: https://developers.openai.com/api/docs/guides/chatkit
