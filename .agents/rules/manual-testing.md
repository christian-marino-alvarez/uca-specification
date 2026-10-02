# Regla: Pruebas Manuales por el Usuario

- **Pruebas Manuales Obligatorias**: El usuario prueba siempre la aplicación e interfaz web a mano en su propio navegador.
- **Prohibición de Browser Subagent Automático**: No lanzar subagentes de navegador (`browser_subagent`) de forma autónoma o no solicitada expresamente.
- **Notificación Directa**: Tras compilar los cambios con `npm run build:app`, confirmar que el código y los tipos son correctos y ceder el control al usuario para su verificación en `http://localhost:3000/`.
